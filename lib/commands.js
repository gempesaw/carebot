import { persistJira } from '~/lib/commands/jira';
import { getCupcake, getEnhancedCupcake, clearCupcakeCache } from '~/lib/commands/cupcake';
import { lunchDeals } from '~/lib/commands/lunch';
import { claimYourpieDeal } from '~/lib/commands/yourpie';
import { queueDeploy, cancel } from '~/lib/commands/deploy';
import parseAction from '~/lib/parser';

export { getFlowbotCommands };
export default handleCommand;

function handleCommand(event, commands = getFlowbotCommands()) {
    if (! looksLikeCommand(event)) {
        persistJira(event);
        return Promise.resolve();
    }

    const command = parseAction(event.content, commands);
    if (command) {
        return command.action(event);
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
    cupcake: {
        action: getCupcake,
        description: getCupcake.description
    },
    enhance: {
        action: (event) => {
            if (isPrivateEnhance(event)) {
                return Promise.resolve('I cannot upload files to private conversations yet. Please try in a flow!');
            }
            else {
                return getEnhancedCupcake((new Date()).getDate());
            }
        },
        description: getEnhancedCupcake.description
    },
    "enhance!": {
        action: (event) => {
            clearCupcakeCache();
            return commands.enhance(event);
        },
        description: clearCupcakeCache.description
    },
    cancel: {
        action: cancel,
        description: cancel.description
    },
    deploy: {
        action: queueDeploy,
        description: queueDeploy.description
    },
    help: { action: () => outputHelp() },
    lunch: {
        action: () => lunchDeals(),
        description: lunchDeals.description
    },
    yourpie: {
        action: claimYourpieDeal,
        description: claimYourpieDeal.description
    }
};

function getFlowbotCommands() {
    return commands;
}

function outputHelp(prefix = '', commands = getFlowbotCommands()) {
    const commandNames = Object.keys(commands);
    const commandsWithHelp = commandNames
          .filter(it => it !== 'help')
          .map(cmd => {
              const name = `\`.${cmd}\``;
              const desc = commands[cmd].description;
              if (desc) {
                  return `${name}: ${desc}`;
              }
              else {
                  return name;
              }
          });
    commandsWithHelp.unshift(prefix + " I only know the following commands:");

    let reply = commandsWithHelp.join("\n- ");
    return Promise.resolve(reply);
}

function isPrivateEnhance(event) {
    return ! event.hasOwnProperty('flow') && event.content === '.enhance';
}
