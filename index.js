"use strict";
const explain_client_1 = require("./src/explain/explain.client");
const formatting_analyzer_1 = require("./src/formatting/formatting.analyzer");
const events_client_1 = require("./src/events/events.client");
const docs_client_1 = require("./src/docs/docs.client");
const angie_1 = require("./src/angie/angie");
const http = require("http");
const command_decoder_1 = require("./src/command-tree/command-decoder");
const versions_client_1 = require("./src/versions/versions.client");
console.log('Environment Variables:');
console.log('TOKEN: ' + process.env.TOKEN);
console.log('NODE_ENV: ' + process.env.NODE_ENV);
console.log('ROOMS: ' + process.env.ROOMS);
const isProd = process.env.NODE_ENV === 'prod';
// the default id for for the https://gitter.im/angie-bot/Lobby chat room for dev
const roomNames = isProd ? process.env.ROOMS : 'angie-bot/Lobby';
const throttleThreshold = 250;
const commandTree = new command_decoder_1.CommandTree();
commandTree.registerSubCommand(new docs_client_1.DocsClient().commandSubtree);
commandTree.registerSubCommand(new events_client_1.EventsClient().commandSubtree);
commandTree.registerSubCommand(new versions_client_1.VersionsClient().commandSubtree);
commandTree.registerSubCommand(new explain_client_1.ExplainClient().commandSubtree);
const analyzerClients = [
    new formatting_analyzer_1.FormattingAnalyzer(),
];
const bots = roomNames.split(',')
    .map(roomName => new angie_1.Angie(process.env.TOKEN, roomName, isProd, commandTree, analyzerClients));
// this should the errors in the server logs
http.createServer(function (request, response) {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('You\'re not really meant to be here');
}).listen(8080);
console.log('Angie Started');
//# sourceMappingURL=index.js.map