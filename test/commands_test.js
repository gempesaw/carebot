import { expect } from 'chai';
import handleCommand from '~/lib/commands';
import td from 'testdouble';

describe('Commands', () => {
    it('should execute the associated command action', async function () {
        let action = td.function('action');
        let event = { content: '.cmd' };
        let commands = {
            cmd: { action: () => Promise.resolve(action('reply')) }
        };

        await handleCommand(event, commands);
        td.verify(action('reply'));
    });

    it('should list commands when invalid command is sent', async function () {
        let event = { content: '.invalid' };
        let commands = { assert: { action: () => {} } };

        let reply = await handleCommand(event, commands);
        console.log(reply);
        expect(reply).to.match(/assert/);
    });

    it('should include getSet commands in help', async () => {
        const event = { content: '.set commandsTestKey goodbye' };
        await handleCommand(event);

        const commands = { assert: { action: () => {} } };
        const helpMsg = await handleCommand({ content: '.invalid'}, commands);
        expect(helpMsg).to.match(/assert[^]*commandsTestKey/m);

        await handleCommand({ content: '.unset testKey' });
    });

    it('should only respond to period-prefixed messages', async function () {
        let event = { content: 'no-prefix' };
        let reply = await handleCommand(event, {});
        expect(reply).to.be.falsy;
    });

    it('should ignore non-prefixed messages', async function () {
        let reply = await handleCommand({ content: 'ignore' }, {});
        expect(reply).to.be.undefined;
    });

    it('should not bother with enhance in a private flow', async function () {
        let reply = await handleCommand({ content: '.enhance' });
        expect(reply).to.match(/cannot upload.*private/);
    });

    it('should not respond to .. prefixed messages', async function () {
        let reply = await handleCommand({ content: '...' });
        expect(reply).to.be.undefined;
    });
});
