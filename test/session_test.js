import { expect } from 'chai';
import { respondToMessages, sendMessage, sendReply } from '~/lib/session';
import config from '~/lib/config';
import * as td from 'testdouble';

describe('Session', () => {
    it('should ignore messages from the bot', () => {
        const event = { user: config.flowdockUserId };
        const reply = respondToMessages(undefined, event);
        expect(reply).to.match(/ignoring our own/i);
    });

    describe('sending messages', () => {
        let session, flow, reply;
        beforeEach(() => {
            session = td.object(['comment', 'stream', 'privateMessage']);
            flow = 'flow';
            reply = 'reply';
        });

        it('should send comments to flows', () => {
            // an event from a flow has an event.flow and event.id for
            // the parent message
            const id = 'id';
            const event = { flow, id };
            sendMessage(session, event, reply);
            td.verify(session.comment(flow, id, reply));
        });

        it('should send PMs to 1 on 1s', () => {
            const user = 'user';
            // one on ones do not have event.flow property, but they
            // do have an event.user
            sendMessage(session, { user }, reply);
            td.verify(session.privateMessage(user, reply));
        });

        it('should add session to sendReply', () => {
            td.when(sendMessage(session, { flow }, 'reply'))
                .thenReturn('message sent');
            respondToMessages(session, { flow });
            const ret = sendReply('reply');
            expect(ret).to.equal('message sent');
        });

    });


});
