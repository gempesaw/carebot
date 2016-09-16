import { expect } from 'chai';

import handleCommand from '~/lib/commands';

describe('Cupcake lookup', () => {
    let event;
    beforeEach( () => {
        event = {
            flow: 'flow',
            id: 'id'
        };
    });

    it('should respond with the cupcake thumbnail', (done) => {
        event.content = '.cupcake';
        handleCommand(event).then(reply => {
            expect(reply).to.match(/ustream/);
            done();
        });
    });
});
