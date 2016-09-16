import getCupcake from '~/lib/commands/cupcake';
import { persistJira } from '~/lib/commands/jira';

export default function handleCommand(session, event) {
    let commands = {
        cupcake: getCupcake
    };

    if (event.content in commands) {
        let action = commands[event.content];
        action()
            .then( msg => {
                session.comment(event.flow, event.id, msg);
            });
    }
    else {
        handleJira(event);
    }
}
