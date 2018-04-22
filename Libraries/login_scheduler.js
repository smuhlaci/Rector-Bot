const Discord = require("discord.js");
const Promise = require("./bluebird.js");

var client;
async function Login(discordClient)
{
    client = discordClient;
    if (process.env.BOT_TOKEN === 'NULL')
    {
        console.error('Change your token settings from .env file. You need to put your private token.');
    }
    else
    {
        console.log('Logging in...');
        await client.login(process.env.BOT_TOKEN);
    }

    if(CLIENT_LOGGED_IN === false)
    {
        console.log(`Could not log in. Starting the Login Scheduler.`);
        StartScheduler();
    }
}

function StartScheduler()
{
    var schedules = new Routines();
	schedules.LoginLoop();
}

function Tick()
{
    console.log('Login retry...');
    client.login(process.env.BOT_TOKEN);
}

var tickLength = 8000;
var runScheduler = true;

function Routines(){}
Routines.prototype.LoginLoop = Promise.coroutine(function*()
{
    while(runScheduler)
    {
		Tick();
		yield Promise.delay(tickLength);
	}
});

function StopScheduler()
{
    console.log('Stopping the scheduler.');
    runScheduler = false;
}

exports.Login = Login;
exports.StopScheduler = StopScheduler;