const PREFIX = '!';

bot = {
    add_client_handlers: function (client) {

        client.on('message', (msg) => {
            let cont = msg.content;
            let channel = msg.channel;

            if (cont.startsWith(PREFIX)) {
                let input = cont.slice(PREFIX.length).split(" ");
                let commandName = input.shift();
                let commandArgs = input.join(" ");

                if(commandName === "help")
                {
                    channel.send("Check out your PM.").then(msg => msg.delete(5000));
                    helpCommands(msg.member.user);
                    msg.delete(5000);
                }

                if (commandName === "role") {

                    var AcceptedRoleIDs = ['322734984483962881','322735296535855105','322736357493702656','322736135988314123'];
                    if(input.length == 0)
                    {
                        channel.send("You can choose these roles: @Coders, @Artists, @Designers and @Composers").
                        then(msg => msg.delete(5000));
                        msg.delete(5000);
                    }else

                    if (input[0] === "add") {
                        let selectedRole = msg.mentions.roles.first();

                        if (selectedRole == null)
                            channel.send("You didn't choose any Role.").then(
                                msg => msg.delete(5000)
                            )
                        else if(msg.member.roles.exists("id",selectedRole.id))
                            channel.send("You already have this role.").then(
                                msg => msg.delete(5000)
                            )
                        else if (AcceptedRoleIDs.includes(selectedRole.id)) {
                            msg.member.addRole(selectedRole).then(
                                channel.send("You just took the role! :kissing_heart:").then(
                                    msg => msg.delete(5000)
                                )
                            );
                        }
                        else channel.send("You can't take this role :thumbsdown:").then(msg => msg.delete(5000));

                        msg.delete(5000);
                    } else if (input[0] === "remove") {
                        let selectedRole = msg.mentions.roles.first();

                        if (selectedRole == null)
                            channel.send("Are you trying to remove nothing? :frowning:");
                        else if (!msg.member.roles.exists("id",selectedRole.id))
                            channel.send("Do not worry, you already don't have this role.").then(
                                msg => msg.delete(5000)
                            )
                        else if (AcceptedRoleIDs.includes(selectedRole.id)) {
                            msg.member.removeRole(selectedRole).then(
                                channel.send("You've removed your role! :kissing_heart:").then(
                                    msg => msg.delete(5000)
                                )
                            );
                        }
                         
                        else 
                            channel.send("You can't remove this role :thumbsdown:").then(
                                msg => msg.delete(5000)
                                );
                                
                        msg.delete(5000);
                    }
                    
                }

                if (commandName === "ping") {
                    channel.send('pong! :ping_pong:');
                }

                if (commandName === "pig") {
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
                if (commandName === "kick") {

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
    }
}

function helpCommands(user)
{
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

module.exports = bot;
