
export interface Version {
  name: string;
  versions: {
    [versionNumber: string]: {
      versions: string;
      homepage: string;
      bugs: {
        url: string;
      }
    }
  };
  'dist-tags': {
    latest: string;
    next: string;
    experimental: string;
  };
}
