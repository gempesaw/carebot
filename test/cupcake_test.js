import { expect } from 'chai';

import handleCommand from '~/lib/commands';

describe('Cupcake lookup', () => {
    it('should respond with the cupcake thumbnail', (done) => {
        handleCommand({ content: '.cupcake' }).then(reply => {
            expect(reply).to.match(/ustream/);
            done();
        });
    });
});
