import getSet from '~/lib/commands/getset.js';
import { expect } from 'chai';
import td from 'testdouble';
import fsp from 'fs-promise';
import path from 'path';

describe('Get Set!', () => {
    const dest = (key = 'testKey') => path.join(__dirname, `../data/${key}`);
    beforeEach(() => fsp.writeFile(dest(), 'test data'));

    it('should return data', async function () {
        const data = await getSet.get({ content: '.get testKey' });
        expect(data).to.equal('test data');
        expect(getSet.get({ content: '.get testKey' })).to.be.a('Promise');
    });

    it('should store data for retrieval', async function () {
        const result = await getSet.set({ content: '.set setTestKey set test data' });
        expect(result).to.match(/Okay, set/);

        const storedData = await getSet.get({ content: '.get setTestKey' });
        expect(storedData).to.equal('set test data');
    });

    it.only('should fail gracefully when file is missing', async function () {
        const data = await getSet.get({ content: '.get missingKey' });
        console.log(data);
        // expect(data).to.not.be.an('Error');
    });

    it('should only use alphanumeric chars for key', async function () {
        const result = await getSet.set({ content: '.set ../hee/../hee/\#$%^&5*/ data'});
        expect(result).to.match(/heehee5/);

        expect(await getSet.get({ content: '.get heehee5' })).to.equal('data');
    });

    it('should list all available keys', async function () {
        const all = await getSet.getAll({ content: '.getAll' });
        expect(all).to.include('heehee5');
        expect(all).to.include('setTestKey');
        expect(all).to.include('testKey');
    });

    it('should unset a key', async function () {
        await getSet.set({ content: '.set unsetKey unset data' });
        const unset = await getSet.unset({ content: '.unset unsetKey' });
        const all = await getSet.getAll();
        expect(all).to.not.include('unsetKey');
    });

    // after(async function () {
    //     const files = [ 'testKey', 'setTestKey', 'heehee5' ].map(dest);
    //     await files.map(async function (it) { await fsp.unlink(it); });
    // });

});
