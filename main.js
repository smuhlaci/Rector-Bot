const Discord = require('discord.js');
const client = new Discord.Client();
const bot = require('./bot.js');

// !!!
// -> Do NOT change this script if it's really not necessary!
// !!!
// Take a look at './bot.js'
//

// '$ node main.js' command is not working.
// you should try '$ nf run nodemon'

console.log(process.env.BOT_TOKEN);
if (process.env.BOT_TOKEN === 'NOTOKEN')
    console.error('Change your token settings from .env file. You need to put your private token.');
else
    client.login(process.env.BOT_TOKEN);

client.on('ready', () => {
    console.log('I am ready!');

    //Handler is here!
    bot.add_client_handlers(client);
});
