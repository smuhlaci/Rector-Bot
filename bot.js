const Discord = require('discord.js');
const client = new Discord.Client();

const PREFIX = '!';

//{
client.login(process.env.BOT_TOKEN, output);
function output(error, token) {
    if (error) {
        console.log(`There was an error logging in: ${error}`);
        return;
    } else
        console.log(`Logged in. Token: ${token}`);
}
//}

client.on('ready', () => {
    console.log('I am ready!');
});

client.on('message', (msg) => {
    let cont = msg.content;
    let channel = msg.channel;

    if (cont.startsWith(PREFIX)) {
        let input = cont.slice(PREFIX.length).split(" ");
        let commandName = input.shift();
        let commandArgs = input.join(" ");

        if (commandName === "ping") {
            channel.send('pong! :ping_pong:');
        }

        if(commandName === "pig"){
            channel.send(':pig:');
        }

        if (commandName === "roleid") {
            channel.send(msg.mentions.roles.first().id);
        }

        //Kendini yok eden kod:
        if (commandName === "exampleCode") {
            channel.send('This answer will self-destruct in 5 sec.').then(msg => msg.delete(5000));
            msg.delete(5000);
        }

        //Sunucudan birisini atma komutu:
        if (commandName === "at") {

            if (msg.member.roles.exists("id", '288244917367734273')) {
                let userToKick = msg.mentions.members.first();
                if (userToKick == null) {
                    channel.send('Komutun kullanımı: !at *[üye]*');
                } else {
                    userToKick.kick().catch(console.error);
                }
            } else {
                channel.send('Bu komutu kullanmak için yetkin yok.')
                console.log(msg.member.roles)
            }
        }
    }

    if (msg.content.search('buluşma') != -1) {
        msg.pin();
    }
})

//Yeni birisi sunucuya katıldığında:
client.on('guildMemberAdd', (member) => {
    const guild = member.guild;

    guild.defaultChannel.send(`Aramıza hoşgeldin ${member.user}. Üye onayı almak için #yeni-kullanicilar kanalına göz at.`);
})

//Sunucudan birisi ayrıldığında:
client.on('guildMemberRemove', (member) => {
    const guild = member.guild;

    guild.defaultChannel.send(`${member.user} çıktı.`);
})
