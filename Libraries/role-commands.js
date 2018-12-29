/*
Every function here is a command that can be used in discord.
All permission checks are done in "./role-commands-base.js".
Don't call these directly, let "./role-commands-base.js" module handle it.
*/
let verifiedRoleID = '288245268095434765';
let mutedRoleID = '524732441093603358';

async function Verify(message)
{
    //Check the bot for permissions
    let botMember = message.guild.me;
    if(!botMember.hasPermission('MANAGE_NICKNAMES') || !(botMember.hasPermission('MANAGE_ROLES')))
    {
        await message.channel.send('The bot does not have sufficient permissions to do this. It needs to be able to manage Roles and change nicknames.');
        return;
    }
    
    
    //Check for mentions
    let mentionedUser = message.mentions.members.first();
    if(mentionedUser == null)
    {
        await message.channel.send("You didn't mention anyone, please mention someone. Check !rolehelp for the correct usage.");
        return;
    }
      
    //Check if the mention is used in the right order
    let mention = message.content.replace(/ +/g, " ").split(' ')[1];
    if(!mention.startsWith("<@"))
    {
        await message.channel.send("Wrong command syntax. Check !rolehelp for correct usage.");
        return;
    }

    //Check if a name is specified
    let name = message.content.replace(/ +/g, " ").split(' ').splice(2).join(' ').replace(/@/g, "");
    if(name === "")
    {
        await message.channel.send("You didn't specify a name. Please specify a name. Check !rolehelp for the correct usage.");
        return;
    }
    
    
    let verifyRoleID = verifiedRoleID;

    //Check if the supplied role is valid
    let role = message.channel.guild.roles.find(role => role.id === verifyRoleID);
    if(role == null)
    {
        await message.channel.send("There is a problem with the roles. Let a moderator know about this.");
        return;
    } 
    
    //Set the role
    let breakOut = false;
    await mentionedUser.addRole(role).catch(async error => 
    {
        console.log(error);
        await message.channel.send('Uh Oh. Something went wrong while adding the role, try again.');
        breakOut = true;
    });

    if(breakOut)
    {
        return;
    }
    
    //Set the nickname
    await mentionedUser.setNickname(name).catch(async error => 
    {
        console.log(error);
        await message.channel.send('Uh Oh. Something went wrong while setting the nickname, try again.');
        breakOut = true;
    });

    if(breakOut)
    {
        return;
    }
    
    message.channel.send(`Verified **${mentionedUser.user.username.replace(/@/g, "")}** (❄${mentionedUser.id}) sucessfully as **${name}**.`);
    return;
}

async function Verified(message)
{
    let members = message.guild.members.map(x => x);
    let memberCount = members.length;

    let verifiedMembers = members.filter(member => {
        role = member.roles.find(role => role.id == verifiedRoleID);
        return role !== null;
    })
    
    let verifiedMemberCount = verifiedMembers.length;
    let nonVerifiedMemberCount = memberCount - verifiedMemberCount;
    
    await message.channel.send(`👥 - There are **${memberCount}** people in the server. \n✅ - Verified: **${verifiedMemberCount}**\n❌ - Non-Verified: **${nonVerifiedMemberCount}**`);
    return;
}

async function Ignore(message)
{
    //Check the bot for permissions
    let botMember = message.guild.me;
    if(!(botMember.hasPermission('MANAGE_ROLES')))
    {
        await message.channel.send('The bot does not have sufficient permissions to do this. It needs to be able to manage Roles.');
        return;
    }
    
    //Check for mentions
    let mentionedUser = message.mentions.members.first();
    if(mentionedUser == null)
    {
        await message.channel.send("You didn't mention anyone, please mention someone.");
        return;
    }
      
    //Check if the mention is used in the right order
    let mention = message.content.replace(/ +/g, " ").split(' ')[1];
    if(!mention.startsWith("<@"))
    {
        message.channel.send("Wrong command syntax. Check !rolehelp for correct usage.");
        return;
    }

    let reason = message.content.replace(/ +/g, " ").split(' ').splice(2).join(' ').replace(/@/g, "");
    if(reason === "")
    {
        reason = "No reason specified.";
    }
    let verifyRoleID = verifiedRoleID;
    let muteRoleID = mutedRoleID;

    //Check if the supplied role is valid
    let verifiedRole = message.channel.guild.roles.find(role => role.id === verifyRoleID);
    if(verifiedRole == null)
    {
        await message.channel.send("There is a problem with the roles. Let a moderator know about this.");
        return;
    }

    let mutedRole = message.channel.guild.roles.find(role => role.id === muteRoleID);
    if(mutedRole == null)
    {
        await message.channel.send("There is a problem with the roles. Let a moderator know about this.");
        return;
    } 
    
    //Set the role
    let breakOut = false;
    await mentionedUser.addRole(mutedRole).catch(async error => 
    {
        console.log(error);
        await message.channel.send('Uh Oh. Something went wrong while adding the role, try again.');
        breakOut = true;
    });

    if(breakOut)
    {
        return;
    }
    
    //Remove the verified role
    await mentionedUser.removeRole(verifiedRole).catch(async error => 
    {
        console.log(error);
        await message.channel.send('Uh Oh. Something went wrong while removing the verified role, try again.');
        breakOut = true;
    });

    if(breakOut)
    {
        return;
    }
    
    message.channel.send(`Muted **${mentionedUser.user.username.replace(/@/g, "")}** (❄${mentionedUser.id}).\nReason: ${reason}`);
    return;
}

async function RemoveIgnore(message)
{
    //Check the bot for permissions
    let botMember = message.guild.me;
    if(!(botMember.hasPermission('MANAGE_ROLES')))
    {
        await message.channel.send('The bot does not have sufficient permissions to do this. It needs to be able to manage Roles.');
        return;
    }
    
    //Check for mentions
    let mentionedUser = message.mentions.members.first();
    if(mentionedUser == null)
    {
        await message.channel.send("You didn't mention anyone, please mention someone.");
        return;
    }
      
    //Check if the mention is used in the right order
    let mention = message.content.replace(/ +/g, " ").split(' ')[1];
    if(!mention.startsWith("<@"))
    {
        message.channel.send("Wrong command syntax. Check !rolehelp for correct usage.");
        return;
    }

    let muteRoleID = mutedRoleID;

    //check if the role is valid
    let mutedRole = message.channel.guild.roles.find(role => role.id === muteRoleID);
    if(mutedRole == null)
    {
        await message.channel.send("There is a problem with the roles. Let a moderator know about this.");
        return;
    } 
    
    //Remove the muted role
    let breakOut = false;
    await mentionedUser.removeRole(mutedRole).catch(async error => 
    {
        console.log(error);
        await message.channel.send('Uh Oh. Something went wrong while removing the verified role, try again.');
        breakOut = true;
    });

    if(breakOut)
    {
        return;
    }
    
    message.channel.send(`Unmuted **${mentionedUser.user.username.replace(/@/g, "")}** (❄${mentionedUser.id}). Requires verification.`);
    return;   
}

async function RoleHelp(message)
{
    let title = "**Role Commands**\n――――――――――――――――――――";
    
    let v = "\n\n-✅- **Verify:** Verifies the mentioned user with the name specified.";
    let vu = "\n**Usage:** `!verify @user Custom Name`"

    let ve = "\n\n-👥- **Verified:** Displays the number of verified users."
    let veu = "\n**Usage:** `!verified`"

    let i = "\n\n-❌- **Ignore:** Mutes a specific user and removes verification."
    let iu ="\n**Usage:** `!ignore @user reason`";

    let r = "\n\n-👀- **RemoveIgnore:** Unmutes a specific member. The member will need re-verification."
    let ru = "\n**Usage:** `!removeignore @user`";

    let finalMessage = title + v + vu + ve + veu + i + iu + r + ru;
    await message.channel.send(finalMessage);
}

exports.Verify = Verify;
exports.Verified = Verified;
exports.Ignore = Ignore;
exports.RemoveIgnore = RemoveIgnore;
exports.RoleHelp = RoleHelp;