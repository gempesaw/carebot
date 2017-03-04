import getSet from '~/lib/commands/getset.js';
import { expect } from 'chai';
import td from 'testdouble';
import fsp from 'fs-promise';
import path from 'path';

describe('Get Set!', () => {
    const dest = (key = 'testKey') => path.join(__dirname, `../data/${key}`);
    beforeEach(() => fsp.writeFile(dest(), 'test data'));

    it('should return data', async () => {
        const data = await getSet.get({ content: '.get testKey' });
        expect(data).to.equal('test data');
        expect(getSet.get({ content: '.get testKey' })).to.be.a('Promise');
    });

    it('should return data for casual invocation', async () => {
        const data = await getSet.maybeGet({ content: '.testKey' });
        expect(data).to.equal('test data');
        expect(getSet.get({ content: '.get testKey' })).to.be.a('Promise');
    });

    it('should store data for retrieval', async () => {
        const result = await getSet.set({ content: '.set setTestKey set test data' });
        expect(result).to.match(/Okay/);

        const storedData = await getSet.get({ content: '.get setTestKey' });
        expect(storedData).to.equal('set test data');
    });

    it('should fail gracefully when file is missing', async () => {
        const data = await getSet.get({ content: '.get missingKey' });
        expect(data).to.not.be.an('Error');
        expect(data).to.include('Invalid key');
    });

    it('should only use alphanumeric chars for key', async () => {
        const result = await getSet.set({ content: '.set ../hee/../hee/\#$%^&5*/ data'});
        expect(result).to.match(/heehee5/);

        expect(await getSet.get({ content: '.get heehee5' })).to.equal('data');
    });

    it('should list all available keys', async () => {
        const all = await getSet.getAll({ content: '.getAll' });
        expect(all).to.include('heehee5');
        expect(all).to.include('setTestKey');
        expect(all).to.include('testKey');
    });

    it('should unset a key', async () => {
        await getSet.set({ content: '.set unsetKey unset data' });
        const unset = await getSet.unset({ content: '.unset unsetKey' });
        const all = await getSet.getAll();
        expect(all).to.not.include('unsetKey');
    });

    after(async () => {
        const files = [ 'testKey', 'setTestKey', 'heehee5' ]
              .map(dest);
        await files.map(async (it) => { await fsp.unlink(it); });
    });

});
