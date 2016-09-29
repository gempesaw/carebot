import { expect } from 'chai';
import handleCommand from '~/lib/commands';

describe('Cupcake lookup', () => {
    it('should respond with the cupcake thumbnail', (done) => {
        const flow = 'flow';
        handleCommand({ content: '.cupcake', flow }).then(reply => {
            expect(reply).to.match(/ustream/);
            done();
        });
    });

    // too lazy to set up chromedriver on travis
    // it('should provide an enhanced cupcake screenshot', (done) => {
    //     handleCommand({ content: '.enhance' }).then(reply => {
    //         done();
    //     });
    // }).timeout(10000);
});
