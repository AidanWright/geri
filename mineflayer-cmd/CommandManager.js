"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandManager = void 0;
const Command_1 = require("./Command");
const Tokenizer_1 = require("./Tokenizer");
class CommandManager {
    constructor(bot) {
        this.commands = [];
        this.log = (sender, message) => {
            if (sender === '[CONSOLE]')
                console.log(message);
            else
                bot.chat(message);
        };
    }
    registerCommand(cmdName, handler, help = "", usage = "") {
        if (help === '' || usage === '') {
            console.warn(`[mineflayer-cmd] Note that leaving command description and usage information is not recommended. (Effected command: '${cmdName}')`);
        }
        const command = new Command_1.Command(cmdName, handler, help, usage);
        this.commands.push(command);
        return command;
    }
    setLogger(logger) {
        this.log = logger;
    }
    run(sender, command) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokens = (0, Tokenizer_1.parseTokens)(command);
            if (tokens.length === 0) {
                throw new Error("Cannot parse empty string!");
            }
            const cmd = this.commands.find(c => c.name === tokens[0]);
            if (!cmd) {
                throw new Error("Command not found!");
            }
            const { flags, args } = (0, Tokenizer_1.extractElements)(tokens, cmd);
            return cmd.handler(sender, flags, args);
        });
    }
}
exports.CommandManager = CommandManager;
