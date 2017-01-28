import { replies } from './replies';
import { Message, User, Model } from './models/message';
import { ApiModule, Api } from './models/api-docs-module';
import { Observable } from 'rxjs';

const request = require('request');
const Gitter = require('node-gitter')
const gitter = new Gitter(process.env.TOKEN)

const isProd = process.env.NODE_ENV === 'prod';

//the default id for for the https://gitter.im/angular-gitter-replybot/Lobby chat room for dev
const roomNames = isProd ? process.env.ROOMS : 'angular-gitter-replybot/Lobby';
const botKeyWord = "angie";
const docsApiBaseUrl = 'https://angular.io/docs/ts/latest/api';
const docsApiUrl = docsApiBaseUrl + '/api-list.json';
let apis: Api[];
let botId = '';



request(docsApiUrl, (error, response, body) => {
  if (!error && response.statusCode == 200) {
    const apiModules: ApiModule = JSON.parse(body);
    apis = Object.keys(apiModules)
      .map(key => apiModules[key])
      //flatten out the modules into a single list of API's
      .reduce((a, b) => [...a, ...b], [])
  }
})


Observable.fromPromise(gitter.currentUser())
  .do((user: User) => botId = user.id)
  .flatMap((user: User) =>
    Observable.forkJoin(roomNames.split(',').map(room => gitter.rooms.join(room))))
  .flatMap((rooms: any[]) => {
    return Observable.forkJoin(
      rooms.map(room => {
        console.log(`Room: ${room.name} ready!`);
        const events = room.streaming().chatMessages();
        return Observable.fromEvent(events, 'chatMessages')
          .filter((message: Message) => message.operation === 'create')
          .map((message: Message) => message.model)
          .do((message: Model) => handleIncommingMessage(room, message))
      })
    )
  })
  .subscribe();

function handleIncommingMessage(room, message: Model) {

  if (message.fromUser.id !== botId || message.text.includes('test')) {

    let replyText = getReply(message.text);
    if (!replyText) {
      console.log('No reply sent')
      return;
    }
    replyText = `@${message.fromUser.username}: ${replyText}`;
    room.send(replyText);
    console.log('Reply sent')
    return;
  }
  console.log('Self message');
}

function getReply(text: string): string {
  const textParts = text.toLowerCase().split(' ');
  text = text.toLowerCase();
  //globals
  if (text.includes('angular3') || text.includes('angular 3')) {
    return replies['angular3'];
  }

  if (text.startsWith(botKeyWord)) {

    if (text.includes('help')) {
      return 'Replies you can ask me for: ' + Object.keys(replies).join(', ')
    }

    if (text.includes('docs')) {
      let matchedApi = apis.find(api => text.includes(api.title.toLowerCase()))

      if (matchedApi) {
        return docsApiBaseUrl + matchedApi.path;
      }
    }

    const key = Object.keys(replies)
      .find(key => key.toLowerCase()
        .split(' ')
        //check to see if each part of the users message is in the key
        .every(part => text.includes(part))
      );

    return key ? replies[key] : replies['noStoredReply'];
  }
}
console.log('Angie Started');
