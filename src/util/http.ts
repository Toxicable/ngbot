import { Observable, Observer } from 'rxjs';
import * as request from 'request';


export class Http {

  get<T>(url): Observable<T> {
    return Observable.create((observer: Observer<T>) => {
      request(url, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          observer.next(JSON.parse(body));
          observer.complete();
        } else {
          observer.error(error);
        }
      });
    });
  }

}
