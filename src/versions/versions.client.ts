import { Version, GitHubApiListTag } from './versions.models';
import { CommandClient } from '../reply-client';
import { MessageModel } from '../angie/gitter.models';
import { MessageBuilder } from '../util/message-builder';
import { Http } from '../util/http';
import * as semver from 'semver';
import { CommandNode } from '../command-tree/command.models';

export class VersionsClient implements CommandClient {

  private githubApiBaseUrl = `https://api.github.com`;

  private repo: string = `angular/angular`;

  private mb = new MessageBuilder();

  private versions: Version[] = [];

  private processVersions(listTags: GitHubApiListTag[]): Version[] {
    const latestStableVersion = listTags
      .map(tag => tag.name)
      .filter(tag => semver.valid(tag) && !semver.prerelease(tag))
      .sort((a, b) => semver.gt(a, b) ? -1 : 1)[0];

    const latestEdgeVersion = listTags
      .map(tag => tag.name)
      .filter(tag => semver.valid(tag) && !!semver.prerelease(tag))
      .sort((a, b) => semver.gt(a, b) ? -1 : 1)[0];

    const stableSha: string = listTags.find(tag => tag.name === latestStableVersion).commit.sha;
    const edgeSha: string = listTags.find(tag => tag.name === latestEdgeVersion).commit.sha;

    const url = 'https://www.github.com/angular/angular';

    return [
      {
        repo: {
          name: this.repo,
          url,
        },
        versions: {
          stable: {
            name: latestStableVersion,
            url: `${url}/commit/${stableSha}`,
          },
          edge: {
            name: latestEdgeVersion,
            url: `${url}/commit/${edgeSha}`,
          },
        },
      }
    ];
  }

  constructor(
    private http = new Http(),
    fallback?: GitHubApiListTag[]
  ) {
    if (fallback) {
      this.versions = this.processVersions(fallback);
    }

    if (this.http) {
      const url: string = `${this.githubApiBaseUrl}/repos/${this.repo}/tags`;
      const options = { url, headers: { 'User-Agent': 'lazarljubenovic' } };
      this.http.get<GitHubApiListTag[]>(options)
        .map(listTag => this.processVersions(listTag))
        .subscribe(versions => this.versions = versions);
    }
  }

  public commandSubtree: CommandNode = {
    name: 'version',
    regex: /^version/,
    children: null,
    help: `Check out what's the current version of Angular`,
    fn: (msg: MessageModel, query?: string) => {
      const repos: string[] = this.versions.map(version => {
        const nameLink = `[**\`${version.repo.name}\`**](${version.repo.url})`;
        const stableLink = `[**${version.versions.stable.name}**](${version.versions.stable.url})`;
        const edgeLink = `[${version.versions.edge.name}](${version.versions.edge.url})`;
        return `${nameLink} is at ${stableLink} (and ${edgeLink})`;
      });
      return this.mb.message(repos.join('; '));
    },
  };

}
