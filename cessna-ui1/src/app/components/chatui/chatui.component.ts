import { Component, OnInit, Output } from '@angular/core';
import { ChatService ,Message} from '../../services/chat.service';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { CallService } from '../../services/call.service';
import { ActivatedRoute } from '@angular/router';
import { Chatmessage } from '../../interface/chatmessage';
import { ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chatui.component.html',
  styleUrls: ['./chatui.component.css']
})
export class ChatuiComponent implements OnInit {
  @ViewChild('messageInput')
  messageInput!: ElementRef;

  adjustTextAreaHeight(textArea: HTMLTextAreaElement) {
    textArea.style.height = 'auto';
    textArea.style.height = textArea.scrollHeight + 'px';
    textArea.style.maxHeight = '60px';

  }
  newMessageText = new FormControl('');
  // Chatmessage: string[] = [];
  username: string = 'User';
  messages: any;
  ischatmsg=false;
  history_data :[] =[];
  phone_number = ""
  Chatmessage:Chatmessage[] = [];
  // newMessageText = new FormControl();

  constructor(private chatService: ChatService, private callsvc:CallService,private route:ActivatedRoute) {
    console.log("component coming")
  }
  

  // private func() {
  //   this.newMessageText = this.getdata();
  //   this.addAIMessage(this.newMessageText, 'prod_lst')
  //   this.ischatmsg=true

  ngOnInit(): void {

    let id= this.route.snapshot.queryParams["id"]

     // let id = qp['id']  
     let splitstring = id.split('|')
     this.phone_number = splitstring[0]
     console.log("Phone Number Received",this.phone_number)

    console.log("hey")
    this.addAIMessage("Hi, I'm cessna Chatbot. Lets talk about the call ;)");

    console.log("vyvg",this.route.queryParams)
    this.route.queryParams.subscribe(i=>{
      let splitstring = id.split('|')
     this.phone_number = splitstring[0]
     console.log("Phone Number Received",this.phone_number)
    })
  }
  addUserMessage(txt: string) {
    this.Chatmessage.push({ txt, sender: 'user', message_type:'txt_msg'});
  }

  addAIMessage(txt: string) {
    this.Chatmessage.push({ txt, sender: 'Ai' , message_type:'txt_msg'});
  }

  sendMessage(): void {
    
    const messageTextarea = this.messageInput
      .nativeElement as HTMLTextAreaElement;
    const msg = messageTextarea.value.trim();
    console.log("coming",this.newMessageText.value)
    console.log("ph",this.phone_number)
    
    if (msg) {
      let message: any = {
        username: this.username,
        text: msg
      };
      // this.Chatmessage.push({"txt":msg, "sender":'Ai', "message_type":'txt_msg'});
      this.addUserMessage(msg)
      this.chatService.sendMessage(message,this.phone_number).subscribe(

        (res:any)=>{
          console.log("Result Came",res)
          console.log(this.phone_number)
          console.log(res.response)
          this.addAIMessage(res.response)
          
        }
      );
      // this.Chatmessage.push(msg);
      this.newMessageText.reset();
      this.newMessageText.setValue('')
      messageTextarea.value = '';
      this.adjustTextAreaHeight(messageTextarea);
    }
 }
  getdata(): FormControl<any> {
    throw new Error('Method not implemented.');
  }
  fetch_history(phone_number:string){
    console.log("phone number is ",phone_number)
    return this.callsvc.gethistory(phone_number).subscribe((res:any)=>{
      this.history_data = res;

      console.log(this.history_data)

      console.log(res) 
    })
  }
} 


