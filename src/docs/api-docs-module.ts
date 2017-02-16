export interface ApiModule {
  [key: string]: Api[];
}


export interface Api {
  title: string;
  path: string;
  docType: string;
  stability: string;
  secure: string;
  barrel: string;
}
