import {replies} from './replies';
import {Observable} from 'rxjs';
import { Angie } from './angie/client';
import * as http from 'http';

console.log('Enviroment Variables:');
console.log('TOKEN: ' + process.env.TOKEN);
console.log('NODE_ENV: ' + process.env.NODE_ENV);
console.log('ROOMS: ' + process.env.ROOMS);

const isProd = process.env.NODE_ENV === 'prod';

//the default id for for the https://gitter.im/angular-gitter-replybot/Lobby chat room for dev
const roomNames: string = isProd ? process.env.ROOMS : 'angular-gitter-replybot/Lobby,angular/angular';

const docsApiBaseUrl = 'https://angular.io/docs/ts/latest/api';
const docsApiUrl = docsApiBaseUrl + '/api-list.json';

const throttleThreshold = 250;

const bots = roomNames.split(",")
  .map(roomName => new Angie(process.env.TOKEN, roomName, docsApiUrl, isProd))


//this should the errors in the server logs
http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('You\'re not really meant to be here');
}).listen(8080);

console.log('Angie Started');
