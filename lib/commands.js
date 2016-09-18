import { persistJira } from '~/lib/commands/jira';
import { getCupcake, getEnhancedCupcake } from '~/lib/commands/cupcake';

export default function handleCommand(event) {
    let command = event.content.replace(/^\./, '');
    let commands = getFlowbotCommands();
    if (command in commands) {
        let action = commands[command];
        return action();
    }
    else {
        persistJira(event);
        if (looksLikeCommand(event)) {
            return outputHelp(`Hmm, I don't understand \`${event.content}\`.`);
        }
        else {
            return new Promise((resolve, reject) => {
                reject('nothing to do here');
            });
        }
    }
}

function looksLikeCommand(event) {
    return /^\./.test(event.content);
}

function getFlowbotCommands() {
    const commands = {
        cupcake: getCupcake,
        enhance: getEnhancedCupcake,
        commands: outputHelp,
        help: outputHelp
    };

    return commands;
}

function outputHelp(prefix = '') {
    let commands = Object.keys(getFlowbotCommands());
    commands.unshift(prefix + " I only know the following commands:");

    let reply = commands.join("\n- .");
    return new Promise(resolve => resolve(reply));
}
