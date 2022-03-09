module.exports = (bot) => {
  const isMasterBot = (sender, flags, args) => {
    return new Promise((resolve, reject) => {
      if (bot.masterBot) bot.tell(sender, "I am master bot!", true);
      else bot.tell(sender, "I am not master bot!", true);
      resolve();
    });
  };

  const addMasterBot = (sender, flags, args) => {
    return new Promise((resolve, reject) => {
      if (bot.masterBot) bot.chat("I am already master bot!");
      else bot.masterBot = true;
      resolve();
    });
  };

  const removeMasterBot = (sender, flags, args) => {
    return new Promise((resolve, reject) => {
      if (bot.masterBot) bot.masterBot = false;
      else bot.chat("I am not master bot!");
      resolve();
    });
  };

  bot.cmd.registerCommand('ismasterbot', isMasterBot,
    'returns T/F for is masterbot',
    ' ');
  bot.cmd.registerCommand('addmasterbot', addMasterBot,
    'returns T/F for is masterbot',
    ' ');
  bot.cmd.registerCommand('removemasterbot', removeMasterBot,
    'returns T/F for is masterbot',
    ' ');
};
