const Discord = require("discord.js");
const client = new Discord.Client();

//Bot libraries
const BasicCommands = require('./Libraries/basic-commands.js');
const RoleCommands = require('./Libraries/role-commands-base.js');
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
        RoleCommands.ProcessComand(message);
    }
});

client.on('guildMemberAdd', (member) => {
    BasicCommands.OnGuildMemberAdd(member);
})

client.on('guildMemberRemove', (member) => {
    BasicCommands.OnGuildMemberRemove(member);
})



