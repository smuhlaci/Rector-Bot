const Discord = require("discord.js");
const client = new Discord.Client();

//Bot libraries
const Animation = require('./Libraries/animation');
const BasicCommands = require('./Libraries/basic-commands.js');
const Database = require('./Libraries/database.js');
const LoginScheduler = require('./Libraries/login_scheduler.js');

//Global variables
PREFIX = '!';
ANIMATION_PREFIX = "%";
REPLY_DURATION = 5000;
CLIENT_LOGGED_IN = false;

//Initialize Database
Database.Initialize();

//LOGIN HERE ->
LoginScheduler.Login(client);


client.on('ready', () => {
    //Update the login flag and stop the login timer
    console.log('Logged in succesfully.');
    CLIENT_LOGGED_IN = true;
    LoginScheduler.StopScheduler();
    
    //Sync Database.
    Database.Authenticate();

	//start the clock that manages the animations
    Animation.StartClock();

    console.log('I am ready!');
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



