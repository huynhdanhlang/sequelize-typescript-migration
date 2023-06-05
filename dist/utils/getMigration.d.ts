export default function getMigration(actions: any): {
    commandsUp: string[];
    commandsDown: string[];
    consoleOut: string[];
};
