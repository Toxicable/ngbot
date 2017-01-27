import { replies } from './replies';
import { Message } from './models/message';

const request = require('request');
const Gitter = require('node-gitter')
const gitter = new Gitter(process.env.TOKEN)

const isProd = process.env.NODE_ENV === 'prod';

//the default id for for the https://gitter.im/angular-gitter-replybot/Lobby chat room for dev
const roomName = isProd ? process.env.ROOM_NAME : 'angular-gitter-replybot/Lobby';
const botKeyWord = "$reply";
let botId = '';

gitter.currentUser()
  .then(user => {
    botId = user.id;
    return gitter.rooms.join(roomName)
  })
  .then(room => {
    const events = room.streaming().chatMessages();

    events.on('chatMessages', (message: Message) => {
      if (message.operation !== 'create') {
        return;
      }
      if (message.model.fromUser.id !== botId || message.model.text.includes('test')) {

        let replyText = getReply(message.model.text);
        if (!replyText) {
          return;
        }
        replyText = `@${message.model.fromUser.username}: ${replyText}`;
        room.send(replyText);
        return;
      }
      console.log('self message, no reply');
    });

    console.log('reply bot ready');
  })

function getReply(text) {
  text = text.toLowerCase(text);
  if (text.includes('angular3') || text.includes('angular 3')) {
    return replies['angular3'];
  }

  if (text.startsWith(botKeyWord)) {
    if (text.includes('help')) {
      return 'Replies you can ask me for: ' + Object.keys(replies).join(', ')
    }

    const key = Object.keys(replies)
      .find(key => key.toLowerCase()
        .split(' ')
        //check to see if each part of the users message is in the key
        .every(part => text.includes(part))
      )

    return key ? replies[key] : replies['noStoredReply'];
  }

  return '';
}

console.log('Reply Bot Started');
