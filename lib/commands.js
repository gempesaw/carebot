import { handleJira } from '~/lib/commands/jira';
import getCupcake from '~/lib/commands/cupcake';

export default function handleCommand({ content }) {
    let commands = [
        { cupcake: getCupcake }
    ];

    if (content in commands) {
        let action = commands[content];
        action();
    }
    else {
        handleJira();
    }
}
