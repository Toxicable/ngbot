import { Observable } from 'rxjs';
import * as request from 'request';

export class Http {

  get<T>(url): Observable<T> {
    return Observable.create((observer) => {
      request(url, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          observer.onNext(JSON.parse(body));
          observer.onCompleted();
        } else {
          observer.onError(error)
        }
      });
    });
  }
}
