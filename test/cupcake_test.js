import { expect } from 'chai';
import getCupcake from '~/lib/commands/cupcake';
import * as fs from 'fs';

describe('Cupcake lookup', () => {
    it('should save a screenshot of the cupcake', () => {
        let file = getCupcake();
        expect(!!fs.openSync('/Users/dgempesaw/.CFUserTextEncoding', 'r'))
            .to.be.true;
    });

});
