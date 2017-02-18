
[![Gitter](https://badges.gitter.im/angie-bot/Lobby.svg)](https://gitter.im/angie-bot/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

# AngieTheBot

A chatbot for scripted replies in the https://gitter.im/angular/angular gitter channel (it's not actually pointed there just yet)

#Commands
The bot is activated by starting with the `angie` keyword
Use: `angie help` - lists all of the current stored replies 

#Development
You will need to set some environment variables to be able to test and debug the bot  

NODE_ENV - prod or dev  
TOKEN - Your personal gitter app token, can be retrieved from: https://developer.gitter.im/apps  
ROOMS - A string of comma delimited room names for the bot to listen to, for example: `angular/angular,angular-gitter-replybot/Lobby`
