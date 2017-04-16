import { Observable } from "rxjs/Rx";

export class MockHttp {

  constructor(private getResponse: any){

  }
  get<T>(url: string): Observable<T> {
    return Observable.of(this.getResponse);
  }
};
