export default parseAction;

function parseAction(content, commands) {
    let command = content
        .replace(/^\./, '') // strip leading prefix
        .toLowerCase();     // accept oddly cased commands

    if (command in commands) {
        return commands[command];
    }
    else {
        return undefined;
    }
}
