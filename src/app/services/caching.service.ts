import { Injectable } from '@angular/core';

import { share } from 'rxjs/operators';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export abstract class CachingService {

  constructor() { }
  
  protected cache<T>(getter: () => Observable<T>,
                     setter: (val: Observable<T>) => void,
                     retreive: () => Observable<T>): Observable<T> {
    const cached = getter();

    if (cached !== undefined) {
      return cached;
    } else {
      const val = retreive().pipe(share());
      setter(val);
      return val;
    }

  }

}