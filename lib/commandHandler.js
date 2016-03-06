import { name as botName } from './config';
import { commands as knownCommands } from './commands';

let isMessage = (event) => event === 'message';
let isMessageAtUs = (msg) => {
    let atUs = '@' + botName;
    msg.startsWith(atUs);
};

let isKnownCommand = (content) => {
    let atUs = '@' + botName;
    let command = content.slice(atUs.length).trim();

    return knownCommands.some(({regex}) => {
        regex.test(command);
    });
};

let isValidCommand = ({event, content}) => {
    if (! isMessage())     { return false; }
    if (! isMessageAtUs()) { return false; }

    return isKnownCommand(content);
};

isValidCommand({ event: 'message', content: '@carebot restart honeydew proxy' });

let doCommand = ({event, content}) => {
    if (!isValidCommand({event, content})) {
        return false;
    }
    else {
        console.log();
        return true;
    }
};

export default doCommand;
