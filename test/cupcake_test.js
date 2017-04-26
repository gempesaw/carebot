import { expect } from 'chai';
import handleCommand from '~/lib/commands';
import { getEnhancedCupcake } from '~/lib/commands/cupcake';
import fsp from 'fs-promise';

describe('Cupcake lookup', () => {
    it('should respond with the cupcake thumbnail', (done) => {
        const flow = 'flow';
        handleCommand({ content: '.cupcake', flow }).then(reply => {
            expect(reply).to.match(/ustream/);
            done();
        });
    });

    // too lazy to set up chromedriver on travis
    // it('should provide an enhanced cupcake screenshot', async () => {
    //     const screenshot = await getEnhancedCupcake();
    //     const png = new Buffer(screenshot.data, 'base64')
    //           .toString('binary');
    //     await fsp.writeFile('cupcake.png', png, 'binary');
    // }).timeout(10000);


});
