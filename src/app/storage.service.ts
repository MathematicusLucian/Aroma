import { Injectable } from "@angular/core";
import "rxjs/add/operator/share";
import { Observable } from "rxjs";

export abstract class StorageService {

  public abstract get(): Storage;
}
  
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService extends StorageService {

  public get(): Storage {
    return localStorage;
  }
  
}