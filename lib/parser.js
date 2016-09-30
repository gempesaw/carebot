export default parseAction;

function parseAction(content, commands) {
    let command = content.replace(/^\./, '');
    if (command in commands) {
        return commands[command];
    }
    else {
        return undefined;
    }
}
