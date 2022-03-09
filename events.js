const config = require(process.cwd() + '/config'); // a classic!

const events = (mineflayer, bot) => {

  /* login and spawn events handled in swarm.js */

  bot.once("end", () => {
    mineflayer.logger.info(`${bot.username} has ended`);
    mineflayer.swarm.bots.splice(mineflayer.swarm.bots.indexOf(mineflayer.swarm.bots.find((x) => {
      return x.username == bot.username;
    })), 1);
    // uncomment to close console if no bots left in swarm
    // will exit process as there will be nothing keeping it alive
    //if (mineflayer.swarm.bots.length <= 1) mineflayer.rl.close();
  });

  bot.on("chat", async (username, message) => {
    const namePrefix = new RegExp(`^${bot.username}`);
    const swarmPrefix = new RegExp(`^swarm`);
    if (config.masters.indexOf(username) == -1) return;
    if (namePrefix.test(message)) {
      const command = message.replace(namePrefix, "");
      await bot.cmd.run(username, command);
    } else if (swarmPrefix.test(message)) {
      const command = message.replace(swarmPrefix, "");
      await bot.cmd.run(username, command);
    }
  });

  bot.on("whisper", async (username, message) => {
    const swarmPrefix = new RegExp(`^swarm`);
    if (config.masters.indexOf(username) == -1) return;
    await bot.cmd.run(username, message);
  });

  mineflayer.rl.on('line', (input) => {
    if (input == 'stop') {
      bot.cmd.run('[CONSOLE]', 'quit');
      mineflayer.rl.close();
    }
    runCommand(input, '[CONSOLE]');
  });

  // helper function for logging and sending messages when mineflayer is inaccessible but bot isn't
  bot.tell = (sender, message, whisper = false) => {
    if (sender === '[CONSOLE]') {
      mineflayer.logger.info(`${bot.username}: ${message}`);
    } else if (whisper) {
      bot.chat(`/w ${sender} ${message}`);
    } else {
      bot.chat(message);
    }
  };

  // helper function for executing commands? idk still thinking this one out
  const runCommand = async (_input, sender) => {
    if (bot.ended) return;
    const args = _input.split(" ");
    let input = args[0].toLowerCase();
    if (args.length == 1) {
      if (config.swarmDisabledCommands.indexOf(input) > -1) return;
    } else {
      if (args[1] !== bot.username) return;
    }

    //const commands = Object.values(bot.cmd.commands).map(x => x.name);
    if (!Object.values(bot.cmd.commands).map(x => x.name).includes(input)) return;

    config.masterBotOnlyCommands.forEach(async command => {
      if (input.includes(command)) {
        if (bot.masterBot) {
          await bot.cmd.run(sender, input, (err) => {
            if (!err) return
            bot.cmd.log(sender, err.message)
          });
        } else return;
      } else {
        await bot.cmd.run(sender, input, (err) => {
          if (!err) return
          bot.cmd.log(sender, err.message)
        });
      }
    });
  };
};

module.exports = events;
