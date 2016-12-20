import { Session } from 'flowdock';
import handleCommand from '~/lib/commands';
import config from '~/lib/config';

function bindToFlows(session, error, flows) {
    let openFlowIds = flows
        .filter(({ open }) => open)
        .map(({ id }) => id);

    // passing user: 1 includes private messages
    let stream = session.stream(openFlowIds, { user: 1 });
    stream.on('message', event => respondToMessages(session, event));
    console.log('Jolly good, we are up and running...');
}

function respondToMessages (session, event) {
    if (isBotMessage(event)) {
        return 'Ignoring our own messages';
    }

    if (event.event === 'message') {
        console.log(`Responding to ${event.content} from ${event.user}`);
        handleCommand(event).then( reply => {
            if (!reply) {
                return;
            }

            if (typeof(reply) === 'object') {
                session.fileComment(event.flow, event.id, reply);
            }
            else {
                sendMessage(session, event, reply);
            }
        }).catch(reply => {
            sendMessage(session, event, reply);
        });
    }
}

function sendMessage(session, event, reply) {
    if (event.flow) {
        return session.comment(event.flow, event.id, reply);
    }
    else {
        // Private Message events don't have flows, and the "flowId"
        // to be used in the response is just the userId, which is on
        // `event.user`
        return session.privateMessage(event.user, reply);
    }
}

function isBotMessage(event) {
    return `${event.user}` === `${config.flowdockUserId}`;
}

export { bindToFlows, respondToMessages, sendMessage };
