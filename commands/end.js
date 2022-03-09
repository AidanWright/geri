module.exports = (bot) => {
  const leave = (sender, flags, args) => {
    return new Promise((resolve, reject) => {
      bot.tell(sender, "Quiting!", true);
      bot.quit();
      bot.ended = true;
      resolve();
    });
  };

  bot.cmd.registerCommand('quit', leave,
    'makes me quit',
    ' ');
  //bot.cmd.registerCommand('end', leave,
  //  'makes me quit',
  //  ' ');
  //bot.cmd.registerCommand('leave', leave,
  //  'makes me quit',
  //  ' ');
};
