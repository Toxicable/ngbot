import {Model} from '../angie/gitter';
import {ReplyClient} from '../reply-client';
import {ApiModule, Api} from './api-docs-module';
import {Http} from '../util/http';
import {getTextPart} from '../util/cli-helper';

export class DocsClient implements ReplyClient {

  private docsApiBaseUrl = 'https://angular.io/docs/ts/latest/api';
  private docsApiUrl = this.docsApiBaseUrl + '/api-list.json';
  private apis: Api[];

  constructor(private http = new Http(),) {
    this.http.get<ApiModule>(this.docsApiUrl).subscribe(docs => {
      this.apis = Object.keys(docs)
        .map(key => docs[key])
        // flatten out the modules into a single list of APIs
        .reduce((a, b) => [...a, ...b], [])
    });
  }

  getGlobal(message: Model) {
    return null;
  }

  getReply(message: Model) {
    const text = message.text;
    const messageParts = text.split(' ');

    if (getTextPart(messageParts, 1) === 'docs') {
      let matchedApi = this.apis.find(api => text.includes(api.title.toLowerCase()));

      let reply: string;
      if (matchedApi) {
        reply = `${this.docsApiUrl}/${matchedApi.path}`;
      } else {
        reply = `Unable to find docs for: ${message}`;
      }
      return reply;
    }
  }

}
