import { expect } from 'chai';
import { claimYourpieDeal, getYourpieLink } from '~/lib/commands/yourpie';
import http from '~/lib/http';
import td from 'testdouble';

describe('YourPie', () => {
    let req, email, content;
    beforeEach(() => {
        req = { get: td.function() };
        email = 'email@example.org';
        content = `.yourpie ${email}`;
    });

    it('should claim the deal', async function () {
        td.when(req.get(getYourpieLink(email)), { times: 2 })
            .thenReturn('Sorry, you\'ve already claimed');

        let res = await claimYourpieDeal({ content }, req);
        expect(res).to.include('All right');
    });

    it('should use the appropriate cohort code', () => {
        let url = getYourpieLink(email);
        expect(url).to.include('HDFTYZIPJB');
    });

    it('should use the appropriate email', () => {
        let url = getYourpieLink(email);
        expect(url).to.include(email);
    });
});
