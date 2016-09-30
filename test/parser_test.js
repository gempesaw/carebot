import { expect } from 'chai';
import parseAction from '~/lib/parser';

describe('Parsing commands', () => {
    let content, commands;
    beforeEach(() => {
        content = '.name';
        commands = {
            name: 'value'
        };
    });

    it('should handle exact string matches', () => {
        expect(parseAction(content, commands)).to.be.truthy;
    });
});
