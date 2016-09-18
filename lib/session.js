import { Session } from 'flowdock';
import config from '~/lib/config';
import handleCommand from '~/lib/commands';

let session = new Session(config.token);
session.flows(bindToFlows);

function bindToFlows(error, flows) {
    let openFlowIds = flows
        .filter(({ open }) => open)
        .map(({ id }) => id);

    let stream = session.stream(openFlowIds);
    stream.on('message', respondToMessages);
}

function respondToMessages (event) {
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
