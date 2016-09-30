import { expect } from 'chai';
import parseAction from '~/lib/parser';

describe('Parsing commands', () => {
    let commands;
    beforeEach(() => {
        commands = {
            key: 'value'
        };
    });

    it('should parse exact string matches', () => {
        const content = 'key';
        const assert = parseAction(`.${content}`, commands);
        expect(assert).to.equal(commands[content]);
    });

    it('should ignore case during matches', () => {
        const content = 'KeY';
        const assert = parseAction(`.${content}`, commands);
        expect(assert).to.equal(commands[content.toLowerCase()]);
    });

    it('should ignore surrounding whitespace', () => {
        const content = '.key     ';
        const assert = parseAction(content, commands);
        expect(assert).to.equal(commands.key);
    });
});
