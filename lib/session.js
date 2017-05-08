import handleCommand from '~/lib/commands';
import config from '~/lib/config';

function respondToMessages (session, event) {
    if (isBotMessage(event)) {
        return 'Ignoring our own messages';
    }

    if (event.event === 'message') {
        handleCommand(event).then( reply => {
            if (!reply) {
                return;
            }

            console.log(`Responding to ${event.content} from ${event.user}`);
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

export { respondToMessages, sendMessage };
