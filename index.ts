import { ExplainClient } from './src/explain/explain.client';
import { FormattingAnalyzer } from './src/formatting/formatting.analyzer';
import { AnalyzerClient } from './src/reply-client';
import { EventsClient } from './src/events/events.client';
import { DocsClient } from './src/docs/docs.client';
import { Angie } from './src/angie/angie';
import * as http from 'http';
import {CommandTree} from './src/command-tree/command-decoder';
import {VersionsClient} from './src/versions/versions.client';

console.log('Environment Variables:');
console.log('TOKEN: ' + process.env.TOKEN);
console.log('NODE_ENV: ' + process.env.NODE_ENV);
console.log('ROOMS: ' + process.env.ROOMS);

const isProd = process.env.NODE_ENV === 'prod';

// the default id for for the https://gitter.im/angie-bot/Lobby chat room for dev
const roomNames: string = isProd ? process.env.ROOMS : 'angie-bot/Lobby';


const throttleThreshold = 250;

const commandTree: CommandTree = new CommandTree();
commandTree.registerSubCommand(new DocsClient().commandSubtree);
commandTree.registerSubCommand(new EventsClient().commandSubtree);
commandTree.registerSubCommand(new VersionsClient().commandSubtree);
commandTree.registerSubCommand(new ExplainClient().commandSubtree);

const analyzerClients: AnalyzerClient[] = [
  new FormattingAnalyzer(),
];

const bots = roomNames.split(',')
  .map(roomName => new Angie(
    process.env.TOKEN,
    roomName,
    isProd,
    commandTree,
    analyzerClients,
    )
  );


// this should the errors in the server logs
http.createServer(function (request, response) {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('You\'re not really meant to be here');
}).listen(8080);

console.log('Angie Started');
