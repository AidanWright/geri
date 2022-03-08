const mineflayer = require('mineflayer'); // the main library for interacting with minecraft
const log4js = require('log4js'); // (` ͜つ´)╭∩╮ CVE-2021-44228
const readline = require('readline'); // for interaction with the console

const config = require(process.cwd() + '/config'); // we use process.cwd() so that pkg does not package the config.
                                                   // pkg maps this path from /project --> /deploy (see: https://www.npmjs.com/package/pkg)
const botEvents = require('./events'); // where we handle most events
                                       /*
                                        * TODO: move events from swarm to here. As the events are eventually bound to the creation
                                        * of the swarm, there shouldn't be any issue. *shouldn't*
                                        */
const swarm = require('./swarm'); // where we handle creation of new bots
                                  /*
                                   * TODO: refactor with helper functions for: adding/removing single bots;
                                   * ensuring login of bots; removal of migrated/dead accounts; multiple swarms;
                                   */

// configure our logger
const date = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
log4js.configure({
  appenders: {
    logFile: {
      type: 'file', // write logs as files
      filename: `${date}.log`,
      maxLogSize: 5242880, // compress after logs reach 5 Mebibytes, measured in bytes
      backups: 3,
      compress: true,
      layout: {
        type: 'basic'
      }
    },
    console: {
      type: 'stdout', // the basic standard out console
      layout: {
        type: 'colored'
      }
    }
  },
  categories: {
    default: {
      appenders: ['logFile', 'console'],
      level: 'debug'
    }
  }
});
mineflayer.logger = log4js.getLogger(); // what could go wrong?
mineflayer.logger.level = 'debug'; // log everything debug and above

// configure our "console" envoirnment
mineflayer.rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  completer: (line) => { // tab-completion featuring command and bot-name completion.
                         // should auto complete all registered commands first, then names after.
                         // expect unexpected behavior if bots are registered with different commands.
    const command = line.split(" ")[0].toLocaleLowerCase();
    if (mineflayer.swarm.bots.length == 0) return ['', line]; // no tab-completion before any bots/commands are initialized/registered
    const commandCompletions = Object.values(mineflayer.swarm.bots[0].cmd.commands).map(x => x.name);
    const nameCompletions = Object.values(mineflayer.swarm.bots).map(x => x.username);
    if (commandCompletions.indexOf(command) > -1) {
      const hits = nameCompletions.filter((c) => c.startsWith(line.split(" ")[1])).map(hit => {
        return `${command} ${hit}`
      });
      const newNames = nameCompletions.map(hit => { // OPTIMIZE: hits does a similar map, so maybe utilize that instead of wasting computations on another loop
        return `${command} ${hit}`
      });
      return [hits.length ? hits : newNames, line]; // commands with name
    } else {
      const hits = commandCompletions.filter((c) => c.startsWith(line.toLowerCase()));
      return [hits.length ? hits : commandCompletions, line]; // just commands. NO names.
    }
  }
});

mineflayer.binder = (bot) => { // we eventually bind this method to the method(s) controlling bot creation, through the below swarm.createSwarm()
  mineflayer.logger.debug(`sucessfully bound and initialized ${bot.username}`);
  mineflayer.logger.info(`${bot.username} has spawned`);
  botEvents(mineflayer, bot); // where the bot logic actually happens
};


swarm.createSwarm(mineflayer, 2); // Lasciate ogne speranza, voi ch'intrate--anonymous function hell awaits.
