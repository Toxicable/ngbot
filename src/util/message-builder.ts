export class MessageBuilder {
  private replyMessage: string;
  private taggedUser: string;

  constructor(message?: string) {
    this.replyMessage = message;
  }

  builder() {
    return this;
  }

  tag(user: string): this {
    this.taggedUser = user;
    return this;
  }

  message(message: string): this {
    this.replyMessage = message;
    return this;
  }

  toString() {
    return this.taggedUser ? `@${this.taggedUser}: ${this.replyMessage}` : this.replyMessage;
  }
}
