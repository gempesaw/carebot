import { expect } from 'chai';
import td from 'testdouble';
import timers from 'testdouble-timers';
import bcsd from 'bounded-context-stuff-doer';

import { queueDeploy, deploy, cancel } from '~/lib/commands/deploy';

timers.use(td);

describe('Deploy', () => {
    const context = 'context';
    const event = { content: `.deploy ${context}` };

    let clock;
    let current, newest, update, restart;
    beforeEach(() => {
        current = td.replace(bcsd, 'current');
        newest = td.replace(bcsd, 'newest');
        update = td.replace(bcsd, 'update');
        restart = td.replace(bcsd, 'restart');
    });

    it('should respond with the current and newest build', async function () {
        td.when(bcsd.current(context)).thenReturn('current');
        td.when(bcsd.newest(context)).thenReturn('newest');

        const res = await queueDeploy(event);
        expect(res).to.include('Current Build: current');
        expect(res).to.include('Newest Build:  newest');
    });

    describe('when not cancelled', () => {
        beforeEach(() => {
            clock = td.timers();
            td.when(newest(context)).thenReturn('newest');
        });

        it('should schedule an update for later', async function () {
            await queueDeploy(event);
            clock.tick(8001);
            td.verify(bcsd.update(context, 'newest'));
        });

        it('should send a restart', async function () {
            await deploy(context);
            td.verify(bcsd.restart(context));
        });
    });

    describe('cancellation', () => {
        beforeEach(() => {
            clock = td.timers();
            td.when(newest(context)).thenReturn('newest');
        });

        it('should not deploy', async function () {
            await queueDeploy(event);
            cancel();
            clock.tick(8001);
            td.verify(bcsd.update(context, 'newest'), { times: 0});
        });
    });

    afterEach(() => {
        cancel();
        td.reset();
    });
});
