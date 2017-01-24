#!/usr/bin/env node

const request = require('request');

const isProd = process.env.NODE_ENV === 'prod';

//the default id for for the https://gitter.im/angular-gitter-replybot/Lobby chat room for dev
const roomId = isProd ? process.env.ROOM_ID : '5886f79fd73408ce4f459bfd';
const token = process.env.TOKEN
const myId = '57787d7fc2f0db084a2127f1';
const heartbeat = " \n";
const botKeyWord = "$reply";
const headers = { 'Authorization': 'Bearer ' + token }

const streamOptions = {
    url: 'https://stream.gitter.im/v1/rooms/' + roomId + '/chatMessages',
    headers,
    method: 'GET',
};

const replyOptions = {
    url: 'https://api.gitter.im/v1/rooms/' + roomId + '/chatMessages',
    headers,
    method: 'POST'
};

const responses = {
    gettingStarted: `- To get started with Angular, do [Quickstart](https://angular.io/docs/ts/latest/quickstart.html). After that, go through [Tour of Heroes (ToH)](https://angular.io/docs/ts/latest/tutorial/). Check the [Guide](https://angular.io/docs/ts/latest/guide/) for how to proceed after that. Good (often advanced) blogs are [Thoughtram](http://blog.thoughtram.io/exploring-angular-2/) and [Victor Savkin's blog](https://vsavkin.com/). A good starting point for a project is [angular-cli](https://github.com/angular/angular-cli)`,
    notEnoughInfo: `- Please provide a brief description of what's going with the code. Pasting the error and saying "it's not working" doesn't help us help you. When did the problem start happening? Does it work if you remove/add some lines? Does it work in a different context? What have you tried so far?`,
    createPlunker: `- It's very helpful to [create a plunker](http://plnkr.co/edit/tpl:AvJOMERrnz94ekVua0u5?p=catalogue) where you create a **minimal** reproduction of your problem, when possible. You're also likely to actually solve the problem yourself while doing so.`,
    pleaseFormat: `- Please format your code. At the bottom-right of the chat's input box there is a \`M\` (Markdown) button which explains how to format snippets.`,
    createGist: `- Please [create a gist](https://gist.github.com/) if your code is more than 8-10 lines long. It's difficult to keep track of the conversation in the chatroom when there is a huge block of code in the way. It's also difficult for us to look at your code this way.`,
    notAngularQuestion: `- For **ng-cli** related questions, see [angular-cli on gitter](https://gitter.im/angular/angular-cli). For **ng-bootstrap**, [open a question on SO](http://stackoverflow.com/questions/tagged/ng-bootstrap).`,
    angular3: `- There won't be Angular3. See more information on [Angular versions past version 2.x.x](http://angularjs.blogspot.co.nz/2016/12/ok-let-me-explain-its-going-to-be.html)`,
};

request(streamOptions)
    .on('error', handError)
    .on('data', (data) => {
        let msgString = data.toString();
        if (msgString === heartbeat) {
            //console.log("hearbeat");
            return;
        }

        const msg = JSON.parse(msgString)
        if (msg.fromUser.id != myId || !isProd) {
            sendReply(msg);
            return;
        }

        console.log('self message, no reply');
    })

function sendReply(msg) {
    let replyText = getReply(msg.text);
    if(!replyText){
        return;
    }
    const reply = Object.assign({}, replyOptions, { form: { text: replyText } });
    request(reply)
        .on('error', handError)
        .on('response', response => console.log('reply sent'));
}

function handError(error) {
    console.error(error);
}

function getReply(text){
    text = text.toLowerCase(text);
    if(text.includes('angular3') || text.includes('angular 3')) {
        return responses.angular3;
    }

    if(text.startsWith(botKeyWord)){
        if(text.includes('getting started')){
            return responses.gettingStarted;
        }

        if(text.includes('not enough info')){
            return responses.notEnoughInfo;
        }

        if(text.includes('create pl')){
            return responses.createPlunker;
        }

        if(text.includes('create gist')){
            return responses.createPlunker;
        }

        if(text.includes('format')){
            return responses.pleaseFormat;
        }

        if(text.includes('not related')){
            return responses.notAngularQuestion;
        }



        return response.notEnoughInfo;
    }

    return '';
}
