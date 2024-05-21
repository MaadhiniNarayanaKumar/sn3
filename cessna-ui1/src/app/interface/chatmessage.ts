export interface Chatmessage {
    txt: string;
    message_type: 'txt_msg' ;
    sender: 'user' | 'Ai';
}
