import { Injectable } from "@angular/core";
import * as CryptoJS from "crypto-js";
import { Subject } from "rxjs";

export enum ObjectType {
  text,
  json,
}

@Injectable({
  providedIn: "root",
})
export class LocalService {
  key = "assseerrsseeerrtyuuugghh";
  isUser = new Subject<boolean>();
  isUser$ = this.isUser.asObservable()
  constructor() {}

  public saveData(
    key: string,
    value: string,
    type: ObjectType,
    isEncryptRequired: boolean
  ) {
    if (isEncryptRequired) {
      if (type == ObjectType.text) {
        localStorage.setItem(key, this.encrypt(value));
      }
      if (type == ObjectType.json) {
        const stringifiedValue = JSON.stringify(value);
        localStorage.setItem(key, this.encrypt(stringifiedValue));
      }
    } else {
      if (type == ObjectType.json) {
        const stringifiedValue = JSON.stringify(value);
        localStorage.setItem(key, stringifiedValue);
      } else {
        localStorage.setItem(key, value);
      }
    }
  }

  public getData(key: string, type: ObjectType, isDecryptRequired: boolean) {
    //console.log("key: ", key);
    if (isDecryptRequired) {
      if (type == ObjectType.json) {
        let data = localStorage.getItem(key) || "";
        if (data == "") {
          return null;
        }
        //console.log(data);
        let jsonObj = JSON.parse(this.decrypt(data));
        return jsonObj;
      } else {
        let data = localStorage.getItem(key) || "";
        return this.decrypt(data);
      }
    } else {
      return localStorage.getItem(key);
    }
  }
  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  public clearData() {
    localStorage.clear();
  }
  private encrypt(txt: string): string {
    return CryptoJS.AES.encrypt(txt, this.key).toString();
  }

  private decrypt(txtToDecrypt: string) {
    return CryptoJS.AES.decrypt(txtToDecrypt, this.key).toString(
      CryptoJS.enc.Utf8
    );
  }

  setUserData(key:string,val:any){
    localStorage.setItem(key,val);
    // console.log(plist)

    console.log('localStorage set');
  }
  getUserData(key:string){
    // localStorage.clear();
    let get=localStorage.getItem(key);
    // console.log('localStorage get',get);
    return get;
  }
}
