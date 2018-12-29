const Discord = require("discord.js");

function getRole(roleInput, channel) {
    if(roleInput == null)
        return null;
    //Sırasıyla mention, ID ve roleİsmi kombinasyonlarını deneyeceğiz. -Mert
    return channel.guild.roles.find(role => role.toString() === roleInput)
        || channel.guild.roles.find(role => role.id === roleInput) 
        || channel.guild.roles.find(role => role.name.toLowerCase() === roleInput.toLowerCase());
    
}

async function RunCommand(msg, channel)
{
    let input = msg.content.slice(PREFIX.length).split(" ");
    let commandName = input.shift().toLowerCase();
    
    if (commandName === "roleset") {
        msg.delete(REPLY_DURATION);
        if (msg.member.permissions.has('MANAGE_ROLES')) {
            if (input.length === 0) {

                let roleList = await AllowedRoles.findAll({ attributes: ['name'] });

                if (roleList.length < 1) {
                    SendNotification('Could not find any role. Contact with admin.');
                    return;
                }

                let result = 'Allowed roles are: ';
                result += roleList.map(t => t.name).join(', ') + ".";

                SendNotification(result, channel);
            }
            else if (input[0] === "add") {
                let roleInput = input[1];
                let selectedRole = getRole(roleInput, channel);

                if (selectedRole == null) {
                    SendNotification("You didn't choose any Role.")
                    return;
                }

                // INSERT INTO ...
                AllowedRoles.create({ roleId: selectedRole.id, name: selectedRole.name })
                    .then(() => { SendNotification("The role is now allowed.")})
                    .catch((e) => {
                        if (e.name === "SequelizeUniqueConstraintError")
                            SendNotification("That role already exists.");
                        else {
                            console.error(e);
                            channel.send(e);
                        }
                    });
            }
            else if (input[0] === "remove") {
                let roleInput = input[1];
                let selectedRole = getRole(roleInput, channel);

                if (selectedRole == null) {
                    SendNotification("You didn't choose any Role.");
                    return;
                }

                // DELETE FROM . . .
                let rowCount = await AllowedRoles.destroy({ where: { roleId: selectedRole.id } })
                console.log(rowCount);
                if (rowCount) SendNotification("Role removed.");
                else SendNotification("That role did not exist.");
            }
            else SendNotification("Invalid command.");

        }
        else SendNotification("You don't have permission to manage roles.");
    }

    else if (commandName === "role") {

        msg.delete(REPLY_DURATION);
        // SELECT name FROM tags ...
        let roleList = await AllowedRoles.findAll({ attributes: ['roleId', 'name'] });

        if (input.length == 0) {

            if (roleList.length < 1) {
                SendNotification('Could not find any role. Contact with admin.');
                return;
            }

            let result = 'Allowed roles are: ';
            result += roleList.map(t => t.name = `**${t.name}**`).join(', ') + ".";

            SendNotification(result);
        } else

            if (input[0] === "add") {
                let roleInput = input[1];
                let selectedRole = getRole(roleInput, channel);

                if (selectedRole == null)
                    SendNotification("You didn't choose any Role.");
                else if (msg.member.roles.exists("id", selectedRole.id))
                    SendNotification("You already have this role.");
                else if (roleList.map(t => t.roleId).includes(selectedRole.id)) {
                    msg.member.addRole(selectedRole).then(
                        SendNotification("You just took the role! :kissing_heart:")
                    );
                }
                else SendNotification("You can't take this role :thumbsdown:");

            } else if (input[0] === "remove") {
                let roleInput = input[1];
                let selectedRole = getRole(roleInput, channel);

                if (selectedRole == null)
                    SendNotification("Are you trying to remove nothing? :frowning:");
                else if (!msg.member.roles.exists("id", selectedRole.id))
                    SendNotification("Do not worry, you already don't have this role.");
                else if (roleList.map(t => t.roleId).includes(selectedRole.id)) {
                    msg.member.removeRole(selectedRole).then(
                        SendNotification("You've removed your role! :kissing_heart:")
                    );
                }
                else
                    SendNotification("You can't remove this role :thumbsdown:");
            }
            else SendNotification("Invalid command.");

    }

    else if (commandName === "help") {
        SendNotification("Check out your PM.");
        helpCommands(msg.member.user);
        msg.delete(REPLY_DURATION);
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

    else if (commandName === "kick") {
        if (msg.member.roles.exists("id", '288244917367734273')) {
            let userToKick = msg.mentions.members.first();
            if (userToKick == null) {
                SendNotification('Command usage: !kick [member]');
            } else {
                msg.delete(REPLY_DURATION);
                SendNotification("ERROR: Check Console & Contact with Admin.")
                userToKick.kick().catch(console.error);
            }
        } else {
            msg.delete(REPLY_DURATION);
            SendNotification('You don\'t have permission to do that.');
        }
    }

    else if (commandName === "github") {
        channel.send("Check it out: https://github.com/smuhlaci/Rector-Bot");
    }

    function SendNotification(message)
    {
        channel.send(message).then(msg => msg.delete(REPLY_DURATION));
    }
}

let WelcomeMessageChannelID = '331714238148116480';
function OnGuildMemberAdd(member)
{
    const channel = member.guild.channels.get(WelcomeMessageChannelID);
    channel.send(`Aramıza hoşgeldin ${member.user}. Onay almak için <#321012534477979648> kanalına göz at.`);
    member.createDM().then((pm) => {
        pm.send("Sunucuya !help yazarak kullanabileceğin komutlara erişim sağlayabilirsin.\n" +
                "#merhaba kanalına kendini veya projeni tanıtan bir paragraf yazmayı unutma."+ 
                "Tabii hepsinden önce facebook grubumuzda olduğunu onaylatman gerekiyor. https://unoghub.org/form adresinden forma ulaşabilirsin. Herhangi bir sorun yaşarsan lütfen https://unoghub.org/facebook sayfasına mesaj veya bilgi@unoghub.org adresine e-posta gönder.")
    })
}

function helpCommands(user) {
    user.createDM().then((pm) => {
        pm.send("-\n"+
            "**General Commands**\n\n" +
            "  **!ping** -- Pong!\n" +
            "  **!pig** -- pig?\n" +
            "  **!help** -- Guess what?\n" +
            "  **!verified** -- Shows current user count.\n" +
            "  **!role** -- Shows allowed roles.\n" +
            "     !role add _Role_ -- Take an allowed role yourself.\n" +
            "     !role remove _Role_ -- Remove an allowed role that you have.\n\n" +
            "**Developer Commands**\n\n" +
            "  **!roleid _Role_** -- Shows the role's ID\n" +
            "  **!github** -- Sends GitHub repository link");
    });
}

function OnGuildMemberRemove(member)
{
    const channel = member.guild.channels.get(WelcomeMessageChannelID);
    channel.send(`${member.user} çıktı.`);
}



exports.RunCommand = RunCommand;
exports.OnGuildMemberAdd = OnGuildMemberAdd;
exports.OnGuildMemberRemove = OnGuildMemberRemove;
