import { Bot } from 'mineflayer';
import { Command } from './Command';
export declare type CommandHandler = (sender: string, flags: any, args: string[]) => void;
export declare type Logger = (sender: string, message: string) => void;
export declare class CommandManager {
    readonly commands: Command[];
    log: Logger;
    constructor(bot: Bot);
    registerCommand(cmdName: string, handler: CommandHandler, help?: string, usage?: string): Command;
    setLogger(logger: Logger): void;
    run(sender: string, command: string): Promise<void>;
}
