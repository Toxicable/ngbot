export interface DocsModule {
  [key: string]: DocsApi[];
}

export interface DocsApi {
  title: string;
  path: string;
  docType: string;
  stability: string;
  secure: string;
  barrel: string;
}
