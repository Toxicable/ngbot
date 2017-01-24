#!/usr/bin/env node

var request = require('request');

var env = process.env.NODE_ENV;

//the default id for for the https://gitter.im/angular-gitter-replybot/Lobby chat room for dev
var roomId = env === 'prod' ? process.env.ROOM_ID : '5886f79fd73408ce4f459bfd';
var token = process.env.TOKEN
var myId = '57787d7fc2f0db084a2127f1';
var heartbeat = " \n";
var botKeyWord = "$reply";
var headers = { 'Authorization': 'Bearer ' + token }

var streamOptions = {
    url: 'https://stream.gitter.im/v1/rooms/' + roomId + '/chatMessages',
    headers,
    method: 'GET',
};

var replyOptions = {
    url: 'https://api.gitter.im/v1/rooms/' + roomId + '/chatMessages',
    headers,
    method: 'POST'
};

request(streamOptions)
    .on('error', handError)
    .on('data', (data) => {
        let msgString = data.toString();
        if (msgString === heartbeat) {
            //console.log("hearbeat");
            return;
        } 

        var msg = JSON.parse(msgString)
        if (msg.fromUser.id != myId || msg.text.startsWith('debug')) {
            sendReply(msg);
            return;
        } 

        console.log('self message, no reply');
    })

function sendReply(msg) {
    var replyText = getReply(msg.text)
    var reply = Object.assign({}, replyOptions, { form: { text: replyText } });
    request(reply)
        .on('error', handError)
        .on('response', response => console.log('reply sent'))
}

function handError(error) {
    console.error(error);
}

function getReply(text){
    if(text.includes('angular3') || text.includes('angular 3')) {
        return "For more information on Angular's versioning past version 2, please see: http://angularjs.blogspot.co.nz/2016/12/ok-let-me-explain-its-going-to-be.html";
    }
}