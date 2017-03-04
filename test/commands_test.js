import { expect } from 'chai';
import handleCommand from '~/lib/commands';
import td from 'testdouble';
import getset from '~/lib/commands/getset';

describe('Commands', () => {
    it('should execute the associated command action', async function () {
        const action = td.function('action');
        const event = { content: '.cmd' };
        const commands = {
            cmd: { action: () => Promise.resolve(action('reply')) }
        };

        await handleCommand(event, commands);
        td.verify(action('reply'));
    });

    it('should list commands when invalid command is sent', async function () {
        const event = { content: '.invalid' };
        const commands = { assert: {
            action: () => {},
            description: 'desc'
        } };

        const reply = await handleCommand(event, commands);
        console.log(reply);
        expect(reply).to.match(/assert.*desc/);
    });

    it('should only respond to period-prefixed messages', async function () {
        const event = { content: 'no-prefix' };
        const reply = await handleCommand(event, {});
        expect(reply).to.be.falsy;
    });

    it('should ignore non-prefixed messages', async function () {
        const reply = await handleCommand({ content: 'ignore' }, {});
        expect(reply).to.be.undefined;
    });

    it('should not bother with enhance in a private flow', async function () {
        const reply = await handleCommand({ content: '.enhance' });
        expect(reply).to.match(/cannot upload.*private/);
    });

    it('should not respond to .. prefixed messages', async function () {
        const reply = await handleCommand({ content: '...' });
        expect(reply).to.be.undefined;
    });

    describe('getSet integration', () => {
        const key = 'commandsTestKey';
        const assert = 'getSetAssert';

        it('should include getSet commands in help', async () => {
            td.replace(getset, 'getAll');
            td.when(getset.getAll())
                .thenReturn([`${key}`]);

            const commands = { assert: { action: () => {} } };
            const helpMsg = await handleCommand({ content: '.invalid'}, commands);

            expect(helpMsg).to.match(new RegExp(`assert[^]*${key}`));
        });

        it('should defer to getSet commands when available', async function () {
            td.replace(getset, 'maybeGet');
            td.when(getset.maybeGet({content: `.${key}`}))
                .thenReturn(assert);

            const event = { content: '.commandsTestKey' };
            const expected = await handleCommand(event);

            expect(expected).to.match(new RegExp(assert));
        });
    });
});
