import { expect } from 'chai';
import { respondToMessages } from '~/lib/session';
import config from '~/lib/config';

describe('Session', () => {
    it('should ignore messages from the bot', () => {
        let event = { user: config.flowdockUserId };
        let reply = respondToMessages(undefined, event);
        expect(reply).to.match(/ignoring our own/i);
    });
});
