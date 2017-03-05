import rp from 'request-promise-native';
import td from 'testdouble';
import nhttp from 'http';
import { expect } from 'chai';

import http from '~/lib/http';

describe('http', () => {
    let server, domain;
    beforeEach(async () => {
        server = await listen();
        const port = server.address().port;

        domain = `http://localhost:${port}`;
    });

    it('should make get requests', async () => {
        const expected = await http.get(`${domain}/assert`);

        expect(expected).to.equal('assert');
    });

    it('should accept options for requests', async () => {
        const expected = await http.get(domain, { qs: { assert: 'assert' } });

        expect(expected).to.equal('?assert=assert');
    });

    after(() => server.close());
});

const listen = () => new Promise((resolve, reject) => {
    const server = nhttp.createServer((req, res) => {
        res.end(req.url.substring(1));
    });
    server.listen(0, () => resolve(server));
});
