export class MessageBuilder{
  private replyMessage: string;
  private taggedUser: string;

  tag(user: string): this{
    this.taggedUser = user;
    return this;
  }
  message(message: string): this{
    this.replyMessage = message
    return this;
  }
  toString(){
    return this.taggedUser ? `@${this.taggedUser}: ${this.replyMessage}`: this.replyMessage;
  }
}
