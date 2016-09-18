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
            if (typeof(reply) === 'object') {
                session.commentFile(event.flow, event.id, reply);
            }
            else {
                session.comment(event.flow, event.id, reply);
            }
        });
    }
}

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
