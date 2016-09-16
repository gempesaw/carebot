import { expect } from 'chai';
import handleCommand from '~/lib/commands';

describe('Commands', () => {
    it('should list available commands for help', (done) => {
        handleCommand({ content: '.help' }).then(reply => {
            expect(reply).to.match(/\.commands/);
            expect(reply).to.match(/\.help/);
            done();
        });
    });

    it('should list commands when invalid command is sent', (done) => {
        handleCommand({ content: '.invalid' }).then(reply => {
            expect(reply).to.match(/\.commands/);
            expect(reply).to.match(/\.help/);
            done();
        });
    });

    it('should ignore non-prefixed messages', (done) => {
        handleCommand({ content: 'ignore' }).catch(err => {
            expect(err).to.match(/nothing/);
            done();
        });

    });
});
