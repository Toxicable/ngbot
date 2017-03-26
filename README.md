[![Gitter](https://badges.gitter.im/angie-bot/Lobby.svg)](https://gitter.im/angie-bot/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

# ngbot
The chatbot for https://gitter.im/angular/angular

## currently under renaming process

# Commands
`angie` - the primary keyword for the bot, most messages will have to suffixed by it to activate the bot
`angie help {area}` - will display the help message for the area given

# Areas
`docs` - gives a brief summary of docs from angular.io  
`versions` - shows the current version of Angular  
`events` - upcomming events for Angular  
`stored replies` - scripted replies for common mistakes or statements used when helping fellow developers

# Development
Tests are done through Karma with `npm run test`
To start the bot you will need the following envrioment variables

NODE_ENV - dev  
TOKEN - Your personal gitter app token, can be retrieved from: https://developer.gitter.im/apps  

Angie will then listen to messages at https://gitter.im/angie-bot/Lobby
