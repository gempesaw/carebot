import { expect } from 'chai';
import handleCommand from '~/lib/commands';
import td from 'testdouble';

describe('Commands', () => {
    it('should execute the associated command action', async function () {
        let action = td.function('action');
        let event = { content: '.cmd' };
        let commands = {
            cmd: () => new Promise((resolve, reject) => resolve(action('reply')))
        };

        await handleCommand(event, commands);
        td.verify(action('reply'));
    });

    it('should list commands when invalid command is sent', async function () {
        let reply = await handleCommand({ content: '.invalid' }, {});
        expect(reply).to.match(/don't understand/);
    });

    it('should ignore non-prefixed messages', async function () {
        let reply = await handleCommand({ content: 'ignore' }, {});
        expect(reply).to.be.falsy;
    });
});
