import {ReplyClient} from '../reply-client';
import {MessageModel} from '../angie/gitter';
import {MessageBuilder} from '../util/message-builder';
import {Http} from '../util/http';
import * as semver from 'semver';
import {CommandNode} from '../angie/command-decoder';


export const VERSIONS_FALLBACK = [
  {
    name: 'g3_v2_0',
    zipball_url: 'https://api.github.com/repos/angular/angular/zipball/g3_v2_0',
    tarball_url: 'https://api.github.com/repos/angular/angular/tarball/g3_v2_0',
    commit: {
      sha: 'ca16fc29a640bd0201a5045ff128d3813088bdc0',
      url: 'https://api.github.com/repos/angular/angular/commits/ca16fc29a640bd0201a5045ff128d3813088bdc0'
    }
  },
  {
    name: '4.0.0-beta.7',
    zipball_url: 'https://api.github.com/repos/angular/angular/zipball/4.0.0-beta.7',
    tarball_url: 'https://api.github.com/repos/angular/angular/tarball/4.0.0-beta.7',
    commit: {
      sha: '09b4bd0dfbfda800796f7dac0b0206e49243b23c',
      url: 'https://api.github.com/repos/angular/angular/commits/09b4bd0dfbfda800796f7dac0b0206e49243b23c'
    }
  },
  {
    name: '2.4.7',
    zipball_url: 'https://api.github.com/repos/angular/angular/zipball/2.4.7',
    tarball_url: 'https://api.github.com/repos/angular/angular/tarball/2.4.7',
    commit: {
      sha: 'e90661aaee5ff6580a52711e1b75795b75cc9700',
      url: 'https://api.github.com/repos/angular/angular/commits/e90661aaee5ff6580a52711e1b75795b75cc9700'
    }
  },
  {
    name: '2.4.6',
    zipball_url: 'https://api.github.com/repos/angular/angular/zipball/2.4.6',
    tarball_url: 'https://api.github.com/repos/angular/angular/tarball/2.4.6',
    commit: {
      sha: '343ee8a3a23dfcd171b018b8dfe85d571afccd6b',
      url: 'https://api.github.com/repos/angular/angular/commits/343ee8a3a23dfcd171b018b8dfe85d571afccd6b'
    }
  },
];

export interface Version {
  repo: {
    name: string;
    url: string;
  };
  versions: {
    stable: {
      name: string;
      url: string;
    };
    edge: {
      name: string;
      url: string;
    }
  };
}

export interface GitHubApiListTag {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  zipball_url: string;
  tarball_url: string;
}

export class VersionsClient implements ReplyClient {

  private githubApiBaseUrl = `https://api.github.com`;

  private repo: string = `angular/angular`;

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

  constructor(private mb: MessageBuilder = new MessageBuilder(),
              private http = new Http(),
              fallback = null) {
    if (fallback) {
      this.versions = this.processVersions(fallback);
    }

    if (this.http) {
      const url: string = `${this.githubApiBaseUrl}/repos/${this.repo}/tags`;
      const options = {url, headers: {'User-Agent': 'lazarljubenovic'}};
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
    fn: () => {
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
