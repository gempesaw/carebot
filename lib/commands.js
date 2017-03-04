import R from 'ramda';

import { persistJira } from '~/lib/commands/jira';
import { getCupcake, getEnhancedCupcake, clearCupcakeCache } from '~/lib/commands/cupcake';
import { lunchDeals } from '~/lib/commands/lunch';
import { claimYourpieDeal } from '~/lib/commands/yourpie';
import getSet from '~/lib/commands/getset';
import deploy from '~/lib/commands/deploy';
import parseAction from '~/lib/parser';

export { getFlowbotCommands };
export default handleCommand;

// (event: FlowdockEvent, commands: Commands) => Promise
async function handleCommand(event, commands = getFlowbotCommands()) {
    if (! looksLikeCommand(event)) {
        persistJira(event);
        return;
    }

    const command = parseAction(event.content, commands);
    if (command) {
        return command.action(event);
    }
    else {
        const gotSet = await getSet.maybeGet(event);
        if (gotSet) {
            return gotSet;
        }
        else {
            return outputHelp(
                `Hmm, I don't understand \`${event.content}\`.`,
                commands
            );
        }
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

    deploy: {
        action: deploy.queue,
        description: deploy.queue.description
    },
    contexts: {
        action: deploy.contexts,
        description: deploy.contexts.description
    },
    cancel: {
        action: deploy.cancel,
        description: deploy.cancel.description
    },

    set: {
        action: getSet.set,
        description: getSet.set.description
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

async function outputHelp(prefix = '', commands = getFlowbotCommands()) {
    const getSetCommands = await getSet.getAll();
    const hasGetSetCmds = getSetCommands.length;
    const commandNames = (Object.keys(commands || {}))
          .concat(hasGetSetCmds ? ['-------------'] : [])
          .concat(hasGetSetCmds ? getSetCommands : []);

    const commandsWithHelp = commandNames
          .filter(it => ! /^(?:cancel|deploy|contexts|help)$/.test(it))
          .map(cmd => {
              const name = /-+/.test(cmd) ? cmd : `- \`.${cmd}\``;
              const desc = R.prop(commands[cmd], 'description');
              if (desc) {
                  return `${name}: ${desc}`;
              }
              else {
                  return name;
              }
          });

    const reply = [prefix + " I only know the following commands:"]
          .concat(commandsWithHelp)
          .join("\n");

    return Promise.resolve(reply);
}

function isPrivateEnhance(event) {
    return ! event.hasOwnProperty('flow') && event.content === '.enhance';
}
