import { expect } from 'chai';
import { pickCoffee } from '~/lib/commands/coffee';

describe('Coffee', () => {
    it('should pick a random coffee', async function () {
        let reply = await pickCoffee([{ imageUrl: 'url' }]);
        expect(reply).to.equal('url');
    });
});
