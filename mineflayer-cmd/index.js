"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = void 0;
const CommandManager_1 = require("./CommandManager");
const ConsoleInput_1 = require("./ConsoleInput");
const Help_1 = __importDefault(require("./cmds/Help"));
function plugin(bot) {
    const cmdManager = new CommandManager_1.CommandManager(bot);
    // @ts-ignore
    bot.cmd = cmdManager;
    // @ts-ignore
    if (plugin.allowConsoleInput)
        (0, ConsoleInput_1.startConsoleInput)(bot);
    setTimeout(() => {
        (0, Help_1.default)(cmdManager);
        // @ts-ignore
        bot.emit('cmd_ready');
    }, 0);
}
exports.plugin = plugin;
