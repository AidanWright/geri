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
function default_1(cmdManager) {
    function helpCommand(sender, _flags, args) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const log = (msg) => cmdManager.log(sender, msg);
                function listHelpFor(cmd) {
                    log(`${cmd.name} - ${cmd.help}`);
                    log(`  Usage: ${cmd.usage}`);
                    if (cmd.flags.length > 0) {
                        log(`  Flags:`);
                        for (const flag of cmd.flags) {
                            log(`  ${flag.usage}`);
                        }
                    }
                }
                function listAllCommands() {
                    log('Available Commands:');
                    for (const cmd of cmdManager.commands) {
                        listHelpFor(cmd);
                    }
                }
                if (args.length === 0) {
                    listAllCommands();
                }
                else if (args.length === 1) {
                    const cmdName = args[0].toLowerCase();
                    const cmd = cmdManager.commands.find(c => c.name.toLowerCase() === cmdName);
                    if (cmd == null) {
                        log(`Command '${args[0]}' not found!`);
                    }
                    else {
                        listHelpFor(cmd);
                    }
                }
                else {
                    log('Usage: help [command name]');
                }
                resolve();
            });
        });
    }
    //cmdManager.registerCommand('help', helpCommand, 'Lists a description and usage information for all commands.', 'help [command name]');
}
exports.default = default_1;
