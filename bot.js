const Discord = require("discord.js");
const sql = require("sqlite");
const Sequelize = require('sequelize');
const client = new Discord.Client();

const PREFIX = '!';
const REPLY_DURATION = 5000;

let sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    // SQLite only
    storage: 'database.sqlite'
});

let AllowedRoles = sequelize.define('allowedRoles', {
    roleId: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        unique: true
    }
});

//LOGIN HERE:
if (process.env.BOT_TOKEN === 'NOTOKEN')
    console.error('Change your token settings from .env file. You need to put your private token.');
else
    client.login(process.env.BOT_TOKEN);


client.on('ready', () => {
    console.log('I am ready!');
    //Sync Database.
    AllowedRoles.sync();
});
//LOGIN END 

client.on('message', async msg => {
    let cont = msg.content;
    let channel = msg.channel;

    if (cont.startsWith(PREFIX)) {
        let input = cont.slice(PREFIX.length).split(" ");
        let commandName = input.shift();
        let commandArgs = input.join(" ");

        if (commandName === "help") {
            channel.send("Check out your PM.").then(msg => msg.delete(REPLY_DURATION));
            helpCommands(msg.member.user);
            msg.delete(REPLY_DURATION);
        }

        else if (commandName === "roleSet") {
            msg.delete(REPLY_DURATION);
            if (msg.member.permissions.has('MANAGE_ROLES')) {
                if (input.length === 0) {
                    //C#'da yazsam burayı methodun içerisine koymakla kalmaz bu tür methodları yazdığım bir sınıf oluştururdum.
                    //Java'da nasıl oluyor çözemedim -Sercan.

                    msg.delete(REPLY_DURATION);
                    // SELECT name FROM tags ...
                    let roleList = await AllowedRoles.findAll({ attributes: ['roleId'] });

                    if (roleList.length < 1) {
                        channel.send('No role set.').then(msg => msg.delete(REPLY_DURATION));
                        return;
                    }

                    let result = 'Allowed roles are: ';
                    result += roleList.map(t => t.roleId = `<@&${t.roleId}>`).join(', ') + ".";

                    channel.send(result).then(msg => msg.delete(REPLY_DURATION));
                }
                else if (input[0] === "add") {
                    let selectedRole = msg.mentions.roles.first();

                    if (selectedRole == null) {
                        channel.send("You didn't choose any Role.").then(
                            msg => msg.delete(REPLY_DURATION)
                        )
                        return;
                    }

                    // INSERT INTO ...
                    AllowedRoles.create({ roleId: selectedRole.id, name: selectedRole.name })
                        .then(() => { channel.send("The role is now allowed.").then(msg => msg.delete(REPLY_DURATION)) })
                        .catch((e) => {
                            if (e.name === "SequelizeUniqueConstraintError")
                                channel.send("That role already exists.").then(msg => msg.delete(REPLY_DURATION));
                            else {
                                console.error(e);
                                channel.send(e);
                            }
                        });

                    msg.delete(REPLY_DURATION);
                }
                else if (input[0] === "remove") {
                    let selectedRole = msg.mentions.roles.first();

                    if (selectedRole == null) {
                        channel.send("You didn't choose any Role.").then(
                            msg => msg.delete(REPLY_DURATION)
                        )
                        return;
                    }

                    // DELETE FROM . . .
                    let rowCount = await AllowedRoles.destroy({ where: { roleId: selectedRole.id } })
                    console.log(rowCount);
                    if (rowCount) channel.send("Role removed.").then(msg => msg.delete(REPLY_DURATION));
                    else channel.send("That role did not exist.").then(msg => msg.delete(REPLY_DURATION));

                    msg.delete(REPLY_DURATION);
                }
                else channel.send("Invalid command.").then(msg => msg.delete(REPLY_DURATION));

            }
            else channel.send("You don't have permission to manage roles.").then(msg => msg.delete(REPLY_DURATION));
        }

        else if (commandName === "role") {

            msg.delete(REPLY_DURATION);
            // SELECT name FROM tags ...
            let roleList = await AllowedRoles.findAll({ attributes: ['roleId'] });
            console.log(roleList.map(t => t.roleId));
            //var AcceptedRoleIDs = ['322734984483962881', '322735296535855105', '322736357493702656', '322736135988314123'];
            if (input.length == 0) {
                //C#'da yazsam burayı methodun içerisine koymakla kalmaz bu tür methodları yazdığım bir sınıf oluştururdum.
                //Java'da nasıl oluyor çözemedim -Sercan.

                if (roleList.length < 1) {
                    channel.send('No role set.').then(msg => msg.delete(REPLY_DURATION));
                    return;
                }

                let result = 'Allowed roles are: ';
                result += roleList.map(t => t.roleId = `<@&${t.roleId}>`).join(', ') + ".";

                channel.send(result).then(msg => msg.delete(REPLY_DURATION));
            } else

                if (input[0] === "add") {
                    let selectedRole = msg.mentions.roles.first();

                    if (selectedRole == null)
                        channel.send("You didn't choose any Role.").then(
                            msg => msg.delete(REPLY_DURATION)
                        )
                    else if (msg.member.roles.exists("id", selectedRole.id))
                        channel.send("You already have this role.").then(
                            msg => msg.delete(REPLY_DURATION)
                        )
                    else if (roleList.map(t => t.roleId).includes(selectedRole.id)) {
                        msg.member.addRole(selectedRole).then(
                            channel.send("You just took the role! :kissing_heart:").then(
                                msg => msg.delete(REPLY_DURATION)
                            )
                        );
                    }
                    else channel.send("You can't take this role :thumbsdown:").then(msg => msg.delete(REPLY_DURATION));

                } else if (input[0] === "remove") {
                    let selectedRole = msg.mentions.roles.first();

                    if (selectedRole == null)
                        channel.send("Are you trying to remove nothing? :frowning:");
                    else if (!msg.member.roles.exists("id", selectedRole.id))
                        channel.send("Do not worry, you already don't have this role.").then(
                            msg => msg.delete(REPLY_DURATION)
                        )
                    else if (roleList.map(t => t.roleId).includes(selectedRole.id)) {
                        msg.member.removeRole(selectedRole).then(
                            channel.send("You've removed your role! :kissing_heart:").then(
                                msg => msg.delete(REPLY_DURATION)
                            )
                        );
                    }
                    else
                        channel.send("You can't remove this role :thumbsdown:").then(
                            msg => msg.delete(REPLY_DURATION)
                        );
                }
                else channel.send("Invalid command.").then(msg => msg.delete(REPLY_DURATION));

        }

        else if (commandName === "ping") {
            channel.send('pong! :ping_pong:');
        }

        else if (commandName === "pig") {
            channel.send(':pig:');
        }

        else if (commandName === "roleid") {
            channel.send(msg.mentions.roles.first().id);
        }

        //Sunucudan birisini atma komutu:
        else if (commandName === "kick") {

            if (msg.member.roles.exists("id", '288244917367734273')) {
                let userToKick = msg.mentions.members.first();
                if (userToKick == null) {
                    channel.send('Command usage: !kick [member]');
                } else {
                    userToKick.kick().catch(console.error);
                }
            } else {
                channel.send('You don\'t have permission to do that.')
                console.log(msg.member.roles)
            }
        }

        else if(commandName === "github"){
            channel.send("Check it out: https://github.com/smuhlaci/Rector-Bot");
        }
    }
});

//Yeni birisi sunucuya katıldığında:
client.on('guildMemberAdd', (member) => {
    const guild = member.guild;

    guild.defaultChannel.send(`Aramıza hoşgeldin ${member.user}. Üye onayı almak için <#yeni-kullanicilar> kanalına göz at.`);
})

//Sunucudan birisi ayrıldığında:
client.on('guildMemberRemove', (member) => {
    const guild = member.guild;

    guild.defaultChannel.send(`${member.user} çıktı.`);
})

function helpCommands(user) {
    user.createDM().then((pm) => {
        pm.send("  **General Commands**\n\n" +
            "**!ping** -- Pong!\n" +
            "**!pig** -- pig?\n" +
            "**!help** -- Guess what?\n" +
            "**!role** -- Shows allowed roles.\n" +
            "   !role add [@Role] -- Take an allowed role yourself.\n" +
            "   !role remove [@Role] -- Remove an allowed role that you have.\n");
        pm.send("  **Developer Commands**\n\n" +
            "**!roleid [@Role]** -- Shows the role's ID\n");
    }
    );
}
