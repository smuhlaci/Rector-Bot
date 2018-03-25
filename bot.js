const Discord = require("discord.js");
const client = new Discord.Client();

//Bot libraries
const Animation = require('./Libraries/animation');
const BasicCommands = require('./Libraries/basic-commands.js');
const Database = require('./Libraries/database.js');

//Global variables
PREFIX = '!';
ANIMATION_PREFIX = "%";
REPLY_DURATION = 5000;

//Initialize Database
Database.Initialize();

//LOGIN HERE ->
if (process.env.BOT_TOKEN === 'NULL')
    console.error('Change your token settings from .env file. You need to put your private token.');
else
    client.login(process.env.BOT_TOKEN);

client.on('ready', () => {
    console.log('I am ready!');
    
    //Sync Database.
    Database.Authenticate();

	//start the clock that manages the animations
    Animation.StartClock();
});

client.on('message', async message => {
    if(message.author.id === client.user.id)
    {
        return;
    }
    
    let content = message.content;
    let channel = message.channel;

    if (content.startsWith(PREFIX)) {
        BasicCommands.RunCommand(message, message.channel);
    }
    else if(content.startsWith(ANIMATION_PREFIX)){
        let messageSplit =  content.split(" ");
        let commandName = messageSplit[0].substring(1);
        
        if(commandName == "animation"){
            Animation.ProcessAnimationCommand(message);
        }
    }
});

client.on('guildMemberAdd', (member) => {
    BasicCommands.OnGuildMemberAdd(member);
})

client.on('guildMemberRemove', (member) => {
    BasicCommands.OnGuildMemberRemove(member);
})



