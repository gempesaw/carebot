import { persistJira } from '~/lib/commands/jira';
import { getCupcake, getEnhancedCupcake } from '~/lib/commands/cupcake';

export default function handleCommand(event, commands = getFlowbotCommands()) {
    if (! looksLikeCommand(event)) {
        persistJira(event);
        return new Promise((resolve, reject) => resolve());
    }

    let command = event.content.replace(/^\./, '');
    if (command in commands) {
        let action = commands[command];
        return action(event);
    }
    else {
        return outputHelp(
            `Hmm, I don't understand \`${event.content}\`.`,
            commands
        );
    }
}

function looksLikeCommand(event) {
    return /^\./.test(event.content);
}

function getFlowbotCommands() {
    const commands = {
        cupcake: getCupcake,
        enhance: (event) => {
            if (isPrivateEnhance(event)) {
                return Promise.resolve('I cannot upload files to private conversations yet. Please try in a flow!');
            }
            else {
                return getEnhancedCupcake((new Date()).getDate());
            }
        },
        commands: () => outputHelp(),
        help: () => outputHelp()
    };

    return commands;
}

function outputHelp(prefix = '', commands = getFlowbotCommands()) {
    let commandNames = Object.keys(commands);
    commandNames.unshift(prefix + " I only know the following commands:");

    let reply = commandNames.join("\n- .");
    return new Promise(resolve => resolve(reply));
}

function isPrivateEnhance(event) {
    return ! event.hasOwnProperty('flow') && event.content === '.enhance';
}
