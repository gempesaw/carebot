import { expect } from 'chai';
import { handleJira, getLastTicket } from '~/lib/commands/jira';

describe('jira lookup', () => {
    let messageWithTicket;
    beforeEach( () => {
        messageWithTicket = {
            thread_id: 'threadId',
            event: 'message',
            flow: 'flowId',
            content: 'SC-12345'
        };
    });

    it('should persist the most recently mentioned ticket', () => {
        handleJira(messageWithTicket);
        expect(getLastTicket()).to.equal('SC-12345');
    });

});
