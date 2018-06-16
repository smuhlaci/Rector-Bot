const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require('fs');

//Bot libraries
const Animation = require('./Libraries/animation');
const BasicCommands = require('./Libraries/basic-commands.js');
const Database = require('./Libraries/database.js');
const LoginScheduler = require('./Libraries/login_scheduler.js');
const Recorder = require('./Libraries/recorder.js');

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


    // Voice recording
    if (message.content.startsWith('!join')) {
        let [command, ...channelName] = message.content.split(" ");
        if (!message.guild) {
          return message.reply('No private service is available in your area at the moment. Please contact a service representative for more details.');
        }
        const voiceChannel = message.guild.channels.find("name", channelName.join(" "));
        //console.log(voiceChannel.id);
        if (!voiceChannel || voiceChannel.type !== 'voice') {
          return message.reply(`I couldn't find the channel ${channelName}. Can you spell?`);
        }
        voiceChannel.join()
          .then(conn => {
            message.reply('ready!');
            // create our voice receiver
            const receiver = conn.createReceiver();
    
            conn.on('speaking', (user, speaking) => {
              if (speaking) {
                message.channel.sendMessage(`I'm listening to ${user}`);
                // this creates a 16-bit signed PCM, stereo 48KHz PCM stream.
                const audioStream = receiver.createPCMStream(user);
                // use IDs instead of username cause some people have stupid emojis in their name
                const fileName = `${voiceChannel.id}-${user.id}-${Date.now()}`;
                // create an output stream so we can dump our data in a file
                const outputStream = Recorder.generateOutputFile(fileName);
                // pipe our audio data into the file stream
                audioStream.pipe(outputStream);
                outputStream.on("data", console.log);
                // when the stream ends (the user stopped talking) tell the user
                audioStream.on('end', () => {
                    //message.channel.sendMessage(`I'm no longer listening to ${user}`);
                    Recorder.convertPCMtoOGG(`${fileName}.pcm`, `${fileName}.ogg`);
                });
              }
            });
          })
          .catch(console.log);
      }
      if(message.content.startsWith('!leave')) {
        let [command, ...channelName] = message.content.split(" ");
        let voiceChannel = message.guild.channels.find("name", channelName.join(" "));
        voiceChannel.leave();

        Recorder.mergeConvertedAudios("output.ogg");
    } // Voice recording end

    
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