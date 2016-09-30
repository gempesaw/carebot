import { expect } from 'chai';
import handleCommand from '~/lib/commands';
import td from 'testdouble';

describe('Commands', () => {
    it('should execute the associated command action', async function () {
        let action = td.function('action');
        let event = { content: '.cmd' };
        let commands = {
            cmd: () => Promise.resolve(action('reply'))
        };

        await handleCommand(event, commands);
        td.verify(action('reply'));
    });

    it('should list commands when invalid command is sent', async function () {
        let event = { content: '.invalid' };
        let commands = { assert: () => {} };

        let reply = await handleCommand(event, commands);
        expect(reply).to.match(/assert/);
    });

    it('should only respond to period-prefixed messages', async function () {
        let event = { content: 'no-prefix' };
        let reply = await handleCommand(event, {});
        expect(reply).to.be.falsy;
    });

    it('should ignore non-prefixed messages', async function () {
        let reply = await handleCommand({ content: 'ignore' }, {});
        expect(reply).to.be.falsy;
    });

    it('should not bother with enhance in a private flow', async function () {
        let reply = await handleCommand({ content: '.enhance' });
        expect(reply).to.match(/cannot upload.*private/);
    });
});
