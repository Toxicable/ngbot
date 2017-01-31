import {replies} from './replies';
import {Message, User, Model} from './models/message';
import {ApiModule, Api} from './models/api-docs-module';
import {Observable} from 'rxjs';
import request = require('request');
import Gitter = require('node-gitter');

console.log('Enviroment Variables:');
console.log('TOKEN: ' + process.env.TOKEN);
console.log('NODE_ENV: ' + process.env.NODE_ENV);
console.log('ROOMS: ' + process.env.ROOMS);

const gitter = new Gitter(process.env.TOKEN);
const isProd = process.env.NODE_ENV === 'prod';

//the default id for for the https://gitter.im/angular-gitter-replybot/Lobby chat room for dev
const roomNames = isProd ? process.env.ROOMS : 'angular-gitter-replybot/Lobby';
const botKeyWord = "angie";

const docsApiBaseUrl = 'https://angular.io/docs/ts/latest/api';
const docsApiUrl = docsApiBaseUrl + '/api-list.json';

const throttleThreshold = 250;
/* ms */
let lastMessagePostedAt: number = null;

let apis: Api[];
let botId = '';

//this should the errors in the server logs
import http = require("http");
http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('You\'re not really meant to be here');
}).listen(8080);


request(docsApiUrl, (error, response, body) => {
  if (!error && response.statusCode == 200) {
    const apiModules: ApiModule = JSON.parse(body);
    apis = Object.keys(apiModules)
      .map(key => apiModules[key])
      //flatten out the modules into a single list of API's
      .reduce((a, b) => [...a, ...b], [])
  }
});


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
          .filter((message: Model) => message.fromUser.id !== botId || message.text.includes('test'))
          .do((message: Model) => handleIncommingMessage(room, message))
      })
    )
  })
  .subscribe(() => {
  }, error => console.log('ERROR: ' + error));


function handleIncommingMessage(room, message: Model) {
  let replyText = getReply(message);
  if (!replyText) {
    console.log('No reply sent');
    return;
  }
  //replyText = ;
  replyText = isProd ? replyText : `DEBUG: ${replyText}`;
  let now = new Date().getTime();
  let timeSinceLastMessage = now - lastMessagePostedAt;
  if (timeSinceLastMessage > throttleThreshold) {
    room.send(replyText);
    let lastMessagePostedAt = now;
    console.log('Reply sent')
  } else {
    console.log(`Time Threshold hit, the last message was sent ${throttleThreshold} ago`)
  }
}


function getReply(message: Model): string {
  let text = message.text.toLowerCase();
  const textParts = text.toLowerCase().split(' ');

  //globals
  if (text.includes('angular3') || text.includes('angular 3')) {
    return replies['angular3'];
  }

  if (text.startsWith(botKeyWord)) {

    if (text.includes('help')) { //personal message them
      return 'Replies you can ask me for: ' + Object.keys(replies).join(', ')
    }
    if (text.includes('hello')) { //personal message them
      return `@${message.fromUser.username}: Hello!`;
    }

    if (text.includes('docs')) {
      return getDocsApiReply(text);
    }

    return getStoredReply(text);

  }
}


function getStoredReply(message: string) {

  const key = Object.keys(replies)
    .find(key => key.toLowerCase()
      .split(' ')
      //check to see if each part of the users message is in the key
      .every(part => message.includes(part))
    );

  return key ? replies[key] : replies['noStoredReply'];
}


function getDocsApiReply(message: string) {
  let matchedApi = apis.find(api => message.includes(api.title.toLowerCase()));

  return matchedApi ? docsApiBaseUrl + matchedApi.path : `Unable to find docs for: ${message}`;
}
console.log('Angie Started');
