import { replies } from './replies';
import { Message } from './models/message';
import { ApiModule, Api } from './models/api-docs-module';

const request = require('request');
const Gitter = require('node-gitter')
const gitter = new Gitter(process.env.TOKEN)

const isProd = process.env.NODE_ENV === 'prod';

//the default id for for the https://gitter.im/angular-gitter-replybot/Lobby chat room for dev
const roomNames = isProd ? process.env.ROOMS : 'angular-gitter-replybot/Lobby,angular/angular';
const botKeyWord = "$a";
const apiDocsUrl = 'https://angular.io/docs/ts/latest/api/api-list.json';
const baseApiUrl = 'https://angular.io/docs/ts/latest/api/';
let apis: Api[];
let botId = '';



request(apiDocsUrl, (error, response, body) => {
  if (!error && response.statusCode == 200) {
    const apiModules: ApiModule = JSON.parse(body);
    apis = Object.keys(apiModules)
      .map(key => apiModules[key])
      .reduce((a, b) => [...a, ...b], [])
  }
})

gitter.currentUser()
  .then(user => {
    botId = user.id;
    return roomNames
    .split(',')
    .map(room => gitter.rooms.join(room));
  })
  .then(roomPromises => Promise.all(roomPromises))
  .then(rooms => {
    rooms.forEach(room => {
      const events = room.streaming().chatMessages();

      events.on('chatMessages', (message: Message) => {
        if (message.operation !== 'create') {
          console.log('Non new message')
          return;
        }
        if (message.model.fromUser.id !== botId || message.model.text.includes('test')) {

          let replyText = getReply(message.model.text);
          if (!replyText) {
            return;
          }
          replyText = `@${message.model.fromUser.username}: ${replyText}`;
          room.send(replyText);
          console.log('Reply sent')
          return;
        }
        console.log('Self message');
      });

      console.log(`Room: ${room.name} ready!`);
    })
  })

function getReply(text: string): string {
  text = text.toLowerCase();
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
        return baseApiUrl + matchedApi.path;
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

  return '';
}

console.log('Angie Started');
