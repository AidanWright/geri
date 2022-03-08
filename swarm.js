const config = require(process.cwd() + '/config'); // a classic!

const mineflayerCmd = require("./mineflayer-cmd/index").plugin; // plugin to manage the commands we send to the bot

// we're gonna need this for dynamically registering our commands
const path = require("path");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);

//adapted from github.com/jrdrwn/mc-bot
const injectModules = async (mineflayer, bot) => {
  const commandFiles = await readdir("./commands/");
  mineflayer.logger.debug(`loading a total of ${commandFiles.length} command files.`);
  const plugins = commandFiles.map(x => x.split(".")[0]);
  const COMMANDS_DIRECTORY = path.join(__dirname, "commands");
  Array.isArray(plugins) && bot.loadPlugins(plugins.map((plugin) => require(path.join(COMMANDS_DIRECTORY, plugin))));
};


const createSwarm = (mineflayer, numberOfBots = 1) => {
  if (numberOfBots < 1) return;
  mineflayer.logger.info(`creating a swarm of ${numberOfBots} bots`);
  mineflayer.swarm = {};
  mineflayer.swarm.bots = [];

  const accounts = config.logins.map(login => login.split(':'));
  addSwarmMembers(mineflayer, accounts, numberOfBots);
}

const addSwarmMembers = async (mineflayer, accounts, numberOfBots) => {
  const connect = ([name, pass], ix) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        mineflayer.logger.debug(`adding swarm member with credentials ${name} and ${pass}`);
        let bot = mineflayer.createBot({
          host: config.host,
          port: config.port,
          username: name,
          password: pass,
          initCallback: mineflayer.binder // binding doesn't work without. idk.
        });

        bot.once("inject_allowed", () => {
          bot.mcData = require("minecraft-data")(bot.version); // start accessing mcData only after injection of plugins is allowed
                                                               // it's safer to do this on spawn, but eggghhhh fuck it
          bot.loadPlugin(mineflayerCmd);
        });

        bot.once("cmd_ready", () => {
          injectModules(mineflayer, bot); // register our commands with the bot being created
        });

        bot.once('spawn', mineflayer.binder.bind(this, bot)); //bind this bot to the binder function (and therefore all the listeners).

        bot.on('login', () => {
          bot.ended = false; // jank
          mineflayer.swarm.bots.push(bot); // So we can keep track of what bots we have
          if (mineflayer.swarm.bots.length == 1) { // janky jank, might remove, need to sort out functionality
            mineflayer.swarm.bots[0].masterBot = true;
            bot.masterBot = true;
          } else {
            mineflayer.swarm.bots[mineflayer.swarm.bots.length - 1].masterBot = false;
            bot.masterBot = false;
          }
          mineflayer.logger.info(`${bot.username} has logged in`);
          resolve(bot); // Promises! Heck Yeah!
        });

        bot.on('error', (err) => reject(err));

        setTimeout(() => reject(Error('Took too long to spawn.')), 5000); // 5 sec
      }, config.interval * ix);
    });
  };

  const accountsToConnect = accounts.filter((element, index) => (index < numberOfBots));
  const botProms = accountsToConnect.map(connect);
  let sucessfullBots = (await Promise.allSettled(botProms)).map(({
    value,
    reason
  }) => value || reason).filter(value => !(value instanceof Error));
  //console.log(accountsToConnect.length - sucessfullBots.length)
  if (accountsToConnect.length - sucessfullBots.length > 0) {
    let accountsWeCanStillConnect = accounts.filter((element, index) => (index >= numberOfBots && index < (numberOfBots + (accountsToConnect.length - sucessfullBots.length))));
    const _botProms = accountsWeCanStillConnect.map(connect);
    await Promise.allSettled(_botProms)
  }
  mineflayer.logger.info(`${mineflayer.swarm.bots.length} / ${accountsToConnect.length} bots successfully logged in.`);
}

module.exports = {
  createSwarm: createSwarm
};
