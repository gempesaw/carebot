import { persistJira } from '~/lib/commands/jira';
import { getCupcake, getEnhancedCupcake, clearCupcakeCache } from '~/lib/commands/cupcake';
import { lunchDeals } from '~/lib/commands/lunch';
import { claimYourpieDeal } from '~/lib/commands/yourpie';
import parseAction from '~/lib/parser';

export { getFlowbotCommands };
export default handleCommand;

function handleCommand(event, commands = getFlowbotCommands()) {
    if (! looksLikeCommand(event)) {
        persistJira(event);
        return Promise.resolve();
    }

    let action = parseAction(event.content, commands);
    if (action) {
        return action(event);
    }
    else {
        return outputHelp(
            `Hmm, I don't understand \`${event.content}\`.`,
            commands
        );
    }
}

function looksLikeCommand({ content }) {
    // starts with '.', doesn't start with '..'
    return /^\.[^.]/.test(content);
}

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
    "enhance!": (event) => {
        clearCupcakeCache();
        return commands.enhance(event);
    },
    lunch: () => lunchDeals(),
    help: () => outputHelp(),
    yourpie: claimYourpieDeal
};

function getFlowbotCommands() {
    return commands;
}

function outputHelp(prefix = '', commands = getFlowbotCommands()) {
    let commandNames = Object.keys(commands);
    commandNames.unshift(prefix + " I only know the following commands:");

    let reply = commandNames.join("\n- .");
    return Promise.resolve(reply);
}

function isPrivateEnhance(event) {
    return ! event.hasOwnProperty('flow') && event.content === '.enhance';
}
