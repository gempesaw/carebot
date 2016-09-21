import { Session } from 'flowdock';
import handleCommand from '~/lib/commands';
import config from '~/lib/config';

function bindToFlows(session, error, flows) {
    let openFlowIds = flows
        .filter(({ open }) => open)
        .map(({ id }) => id);

    let stream = session.stream(openFlowIds);
    stream.on('message', event => respondToMessages(session, event));
}

function respondToMessages (session, event) {
    if (isBotMessage(event)) {
        return 'Ignoring our own messages';
    }

    if (event.event === 'message') {
        handleCommand(event).then( reply => {
            if (!reply) {
                return;
            }

            if (typeof(reply) === 'object') {
                session.commentFile(event.flow, event.id, reply);
            }
            else {
                session.comment(event.flow, event.id, reply);
            }
        }).catch(reply => {
            session.comment(event.flow, event.id, reply);
        });
    }
}

function sendMessage(session, event, reply) {
    if (event.flow) {
        return session.comment(event.flow, event.id, reply);
    }
    else {
        // it's a private message
        return session.privateMessage(event.user, reply);
    }
}

function isBotMessage(event) {
    return `${event.user}` === `${config.flowdockUserId}`;
}

// There is no way to send a file in the node-flowdock library; thus
// we monkey patch it in.
Session.prototype.commentFile = function (flow, message, content) {
    let data = {
        event: 'file',
        tags: [],
        flow,
        message,
        content
    };

    return this.send("/comments", data);
};

export { respondToMessages, sendMessage };
export default bindToFlows;
