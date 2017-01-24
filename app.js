#!/usr/bin/env node

var request = require('request');

var isProd = process.env.NODE_ENV === 'prod';

//the default id for for the https://gitter.im/angular-gitter-replybot/Lobby chat room for dev
var roomId = isProd ? process.env.ROOM_ID : '5886f79fd73408ce4f459bfd';
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
        if (msg.fromUser.id != myId || !isProd) {
            sendReply(msg);
            return;
        } 

        console.log('self message, no reply');
    })

function sendReply(msg) {
    var replyText = getReply(msg.text)
    if(!replyText){
        return;
    }
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

    if(text.startsWith(botKeyWord) && text.includes('getting started')){
        return `To get started with Angular, do [Quickstart](https://angular.io/docs/ts/latest/quickstart.html). 
        After that, go through [Tour of Heroes (ToH)](https://angular.io/docs/ts/latest/tutorial/). 
        Check the [Guide](https://angular.io/docs/ts/latest/guide/) for how to proceed after that. 
        Good (often advanced) blogs are [Thoughtram](https://blog.thoughtram.io/exploring-angular-2/) and [Victor Savkin's blog](https://vsavkin.com/).
        Oh and use the [CLI](https://github.com/angular/angular-cli) unless you have a complex build process `
    
    }


    return '';
}