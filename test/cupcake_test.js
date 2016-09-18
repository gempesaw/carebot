import { expect } from 'chai';

import handleCommand from '~/lib/commands';

describe('Cupcake lookup', () => {
    it('should respond with the cupcake thumbnail', (done) => {
        handleCommand({ content: '.cupcake' }).then(reply => {
            expect(reply).to.match(/ustream/);
            done();
        });
    });

    it('should provide an enhanced cupcake screenshot', (done) => {
        handleCommand({ content: '.enhance' }).then(reply => {
            done();
        });
    }).timeout(10000);
});
