import { handleJira } from '~/lib/commands/jira';
import getCupcake from '~/lib/commands/cupcake';

export default function handleCommand(session, event) {
    let commands = {
        cupcake: getCupcake
    };

    if (event.content in commands) {
        let action = commands[event.content];
        action()
            .then( msg => {
                session.comment(event.flow, event.id, msg);
            })
            .catch( err => {
                session.comment(event.flow, event.id, 'uh, something went wrong: ' + err);
            });
    }
    else {
        handleJira(event);
    }
}
