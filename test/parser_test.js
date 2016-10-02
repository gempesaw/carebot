import { expect } from 'chai';
import parseAction from '~/lib/parser';

describe('Parsing commands', () => {
    let commands, expected;
    beforeEach(() => {
        expected = 'value';
        commands = {
            key: expected
        };
    });

    it('should parse exact string matches', () => {
        const content = '.key';
        const assert = parseAction(content, commands);
        expect(assert).to.equal(expected);
    });

    it('should ignore case during matches', () => {
        const content = '.KeY';
        const assert = parseAction(content, commands);
        expect(assert).to.equal(expected);
    });

    it('should ignore surrounding whitespace', () => {
        const content = '.key     ';
        const assert = parseAction(content, commands);
        expect(assert).to.equal(expected);
    });

    it('should pass through arguments', () => {
        const content = '.key argument';
        const assert = parseAction(content, commands);
        expect(assert).to.equal(expected);
    });
});
