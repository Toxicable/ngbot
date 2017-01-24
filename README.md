# angular-gitter-replybot

A chatbot for scripted replies in the https://gitter.im/angular/angular gitter channel (it's not actually pointed there just yet)

#Commands
The bot is activated by starting with the `$reply` keyword
`$reply help` - lists all of the current stored replies 

#Development
You will need to set some enviroment variables to be able to test and debug the bot  

NODE_ENV - prod or dev  
TOKEN - Your personal gitter app token, can be retrieved from: https://developer.gitter.im/apps  
ROOM_ID - This is the room that the bot will listen and reply to, the default room is https://gitter.im/angular-gitter-replybot/Lobby . A list of your active rooms can be found here: https://api.gitter.im/v1/rooms?access_token={YOUR ACCESS TOKEN} you can view the room id's for each on there  

CD is setup with Azure so a minute or two after commiting changes will be reflected in the production room
