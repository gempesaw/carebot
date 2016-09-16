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
    return {
        cupcake: getCupcake,
        enhance: getEnhancedCupcake
    };
}
