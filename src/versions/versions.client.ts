import { CommandNodeBuilder } from './../command-tree/command-decoder2';
import { Version } from './versions.models';
import { CommandClient } from '../reply-client';
import { MessageModel } from '../bot/gitter.models';
import { MessageBuilder } from '../util/message-builder';
import { Http } from '../util/http';
import * as semver from 'semver';
import { CommandNode } from '../command-tree/command-decoder2';
import { Observable } from 'rxjs'


export class VersionsClient implements CommandClient {

  private registeryBaseUrl = `http://registry.npmjs.org`;

  private mb = new MessageBuilder();
  private versions: Version[] = [];

  private repos = [
    '@angular/core',
    '@angular/cli',
    '@angular/material',
    '@angular/app-shell',
    '@angular/service-worker',
    '@ngtools/webpack',
    'angularfire2',
    'zone.js',
  ];

  commandNode: CommandNode;

  private encodePackageName(name: string) {
    return name.replace('/', '%2F');
  }

  private updateVersions() {

    return Observable.forkJoin(
      ...this.repos
        .map(name => this.encodePackageName(name))
        .map(name => `${this.registeryBaseUrl}/${name}`)
        .map(url => this.http.get<Version>(url))
    );
  }

  constructor(
    private http = new Http(),
  ) {
    //1000 * 60 * 30 is 30 min.. I think :D
    Observable.timer(0, 1000 * 60 * 30)
      .flatMap(i => this.updateVersions())
      .subscribe(versions => {
        this.versions = versions
      });

    this.commandNode = new CommandNodeBuilder()
      .withCommand(/(versions|version)/, msg => new MessageBuilder(`Tells you the current versiosn of Angular and it's related packages`))
      .withChild(b => b.withCommand(/\w/, this.command))
      .withName('versions')
      .toNode();

  }

  private command = (msg: MessageModel) => {
      const repos: string[] = this.versions.map(version => {
        const latestVersion = version['dist-tags'].latest;
        const edgeVersion = version['dist-tags'].experimental || version['dist-tags'].next;
        const nameLink = `[**\`${version.name}\`**](${version.versions[latestVersion].homepage})`;
        const stableLink = `**${latestVersion}**`;
        return `${nameLink} is at ${stableLink} (experimental:${edgeVersion})`;
      });
      const output = repos.join('\n');
      return this.mb.message(output);
    }

}
