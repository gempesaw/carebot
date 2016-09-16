import { Session } from 'flowdock';
import config from '~/lib/config';
import handleCommand from '~/lib/commands';

let session = new Session(config.token);

session.flows((error, flows) => {
    let openFlowIds = flows
        .filter(({ open }) => open)
        .map(({ id }) => id);

    let stream = session.stream(openFlowIds);
    stream.on('message', (event) => {
        if (event.event === 'message') {
            handleCommand(event).then( reply => {
                session.comment(event.flow, event.id, reply);
            });
        }
    });
});
