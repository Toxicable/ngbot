import { ReplyClient } from './../reply-client';
import { ApiModule, Api } from './api-docs-module';
import { Http } from './../util/http';
import { Observable } from 'rxjs';

export class DocsClient implements ReplyClient {

  private docsApiBaseUrl = 'https://angular.io/docs/ts/latest/api';
  private docsApiUrl = this.docsApiBaseUrl + '/api-list.json';
  private apis: Api[];

  constructor(
    private http = new Http(),
  ) {
    this.http.get<ApiModule>(this.docsApiUrl).subscribe(docs => {
      this.apis = Object.keys(docs)
        .map(key => docs[key])
        //flatten out the modules into a single list of API's
        .reduce((a, b) => [...a, ...b], [])
    });
  }

  getGlobal(message: string){
    return null;
  }

  getReply(message: string) {
    let matchedApi = this.apis.find(api => message.includes(api.title.toLowerCase()));

    const reply = matchedApi ? this.docsApiUrl + '/' + matchedApi.path : `Unable to find docs for: ${message}`;
    return reply;
  }
}
