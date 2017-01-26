import { replies } from './replies/contains'
import { otherReplies } from './replies/others'

const request = require('request');
const Gitter = require('node-gitter')
const gitter = new Gitter(process.env.TOKEN)

const isProd = process.env.NODE_ENV === 'prod';

//the default id for for the https://gitter.im/angular-gitter-replybot/Lobby chat room for dev
const roomId = isProd ? process.env.ROOM_ID : '5886f79fd73408ce4f459bfd';
const botKeyWord = "$reply";

let botId = '';

gitter.currentUser()
  .then(user => {
    botId = user.id;
  })
  .then(() => gitter.rooms.join('angular-gitter-replybot/Lobby'))
  .then(room => {
    var events = room.streaming().chatMessages();

    console.log('Reply Bot Ready');
    events.on('chatMessages', message => {

      if (message.operation !== 'create') {
        return;
      }
      if (message.model.fromUser.id !== botId || message.model.text.includes('test')) {

        let replyText = getReply(message.model.text);
        if (!replyText) {
          return;
        }
        room.send(replyText);
        return
      }
      console.log('self message, no reply')
    });
  })

function getReply(text) {
  text = text.toLowerCase(text);
  if (text.includes('angular3') || text.includes('angular 3')) {
    return replies['angular3'];
  }

  if (text.startsWith(botKeyWord)) {
    if (text.includes('help')) {
      return 'Replies you can ask me for: ' + Object.keys(replies)
        .join(', ')
    }

    const key = Object.keys(replies)
      .find(key => key.toLowerCase()
        .split(" ")
        .every(part => text.includes(part))
      )

    return key ? replies[key] : otherReplies.noStoredReply;
  }

  return '';
}

console.log('Reply Bot Started');
