import { expect } from 'chai';
import { lunchDeals } from '~/lib/commands/lunch';

describe('Lunch', () => {
    let deals;
    beforeEach(() => {
        deals = [
            [], // sunday
            [ 'monday' ], // monday
        ];
    });

    it('should give the deals for the appropriate day', async function () {
        let dayNumber = 1;
        let reply = await lunchDeals(dayNumber, deals);
        expect(reply).to.match(new RegExp(deals[dayNumber][0]));
    });

    it('should suggest adding some for empty days', async function() {
        let reply = await lunchDeals(0, deals);
        expect(reply).to.match(/github.*flowbot.*lunch/);
    });

});
