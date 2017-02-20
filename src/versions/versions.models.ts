
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
