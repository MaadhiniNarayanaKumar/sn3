import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, config, throwError } from 'rxjs';
import { ConfigService } from './config.service';

export interface Message {
  username: string
  text: string
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  public messages$ = this.messagesSubject.asObservable();
  apiserviceUrl = "http://localhost:4200";
  callServiceUrl =''
  calsvcurl = 'http://localhost:4000'

  constructor(private http:HttpClient,private config: ConfigService) {
    this.callServiceUrl = config.config.callServiceUrl
    
  }

  sendMessage(message: any,phone_number: String) {
    console.log("service")
    let phonenumber = phone_number
    let prompt = {message,phonenumber}
    const messages = message["text"];
    // this.messagesSubject.next([...messages, message]);
   
    return this.http
      .post(this.calsvcurl + "/chats" , prompt,{
        headers: {
          'Access-Control-Allow-Origin': '*',
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
          "Content-Type": "application/json",
        },
      })
      .pipe(
        catchError((err) => {
          ////console.log("errrorrrrr", err);
          return throwError(err); //Rethrow it back to component
        })
      );
  }
}
