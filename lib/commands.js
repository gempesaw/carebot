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
        return persistJira(event);
    }
}

function getFlowbotCommands() {
    const commands = {
        cupcake: getCupcake,
        // enhance: getEnhancedCupcake,
        commands: outputHelp,
        help: outputHelp
    };

    return commands;
}

function outputHelp() {
    let commands = Object.keys(getFlowbotCommands());

    let reply = "I know the following commands:\n\n- " + commands.join("\n- ");
    return new Promise(resolve => resolve(reply));
}
