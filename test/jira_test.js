import { expect } from 'chai';
import { persistJira, getLastTicket } from '~/lib/commands/jira';

describe('JIRA assist', () => {
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
        persistJira(messageWithTicket);
        expect(getLastTicket()).to.equal('SC-12345');
    });

});
