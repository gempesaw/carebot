import { expect } from 'chai';
import fsp from 'fs-promise';

import { pickCoffee, readCoffeeChoices } from '~/lib/commands/coffee';

describe('Coffee', () => {
    it('should pick a random coffee', async function () {
        let reply = await pickCoffee([{ imageUrl: 'url' }]);
        expect(reply).to.equal('url');
    });

    it('should read the coffee from file', async function () {
        let coffeeData = await readCoffeeChoices();
        expect(coffeeData).to.be.an.array;
    });
});
