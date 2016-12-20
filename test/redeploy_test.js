import { expect } from 'chai';
import tmp from 'tmp-promise';
import td from 'testdouble';
import fsp from 'fs-promise';
import { redeploy } from '~/lib/commands/redeploy';

describe('Re-deploying the app', () => {

    let path, sendMessage;
    beforeEach(async function () {
        path = await tmp.file().path;
        sendMessage = td.function('sendMessage');
    });

    it('should send a message on script failure', async function () {
        fsp.writeFile(path, "exit 1");

        const error = await redeploy('session', 'event', `sh ${path}`, () => {});
        expect(error.toString()).to.include('closed unexpectedly');
    });

    it('should announce shutdown', async function () {
        const shutdown = await redeploy('session', 'event', 'ls -al', sendMessage);
        td.verify(sendMessage('session', 'event', td.matchers.anything()));
    });

});
