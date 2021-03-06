import { expect } from 'chai';
import td from 'testdouble';
import timers from 'testdouble-timers';
import bcsd from 'bounded-context-stuff-doer';

import deploy from '~/lib/commands/deploy';

timers.use(td);

describe('Deploy', () => {
    const context = 'context-context';
    const event = { content: `.deploy ${context}` };

    let clock;
    let current, newest, update, restart, validate;
    beforeEach(() => {
        current = td.replace(bcsd, 'current');
        newest = td.replace(bcsd, 'newest');
        update = td.replace(bcsd, 'update');
        restart = td.replace(bcsd, 'restart');
        validate = td.replace(bcsd, 'validateContext');

        td.when(bcsd.validateContext(context)).thenReturn(true);
    });

    afterEach(() => {
        deploy.cancel();
        td.reset();
    });

    it('should reject invalid contexts', async function () {
        td.when(bcsd.validateContext(context)).thenReturn(false);
        const res = await deploy.queue(event);
        expect(res).to.include('a valid context');
    });

    it('should only run one at a time', async function () {
        td.when(bcsd.current(context)).thenReturn('current');
        td.when(bcsd.newest(context)).thenReturn('newest');

        await deploy.queue(event);
        const failure = await deploy.queue(event);
        expect(failure).to.include('please wait');
    });

    it('should allow two deploys to run sequentially', async function () {
        td.when(bcsd.current(context)).thenReturn('current');
        td.when(bcsd.newest(context)).thenReturn('newest');

        clock = td.timers();
        const success1 = await deploy.queue(event);
        clock.tick(8001);
        const success2 = await deploy.queue(event);
        expect(success2).to.include('will be updated');
    });

    it('should respond with the current and newest build', async function () {
        td.when(bcsd.current(context)).thenReturn('current');
        td.when(bcsd.newest(context)).thenReturn('newest');

        const res = await deploy.queue(event);
        expect(res).to.include('Current Build: current');
        expect(res).to.include('Newest Build:  newest');
    });

    it('should do nothing when current is newest', async function () {
        td.when(bcsd.current(context)).thenReturn('newest');
        td.when(bcsd.newest(context)).thenReturn('newest');
        clock = td.timers();

        const res = await deploy.queue(event);
        clock.tick(8001);
        expect(res).to.include('already deployed');
        td.verify(bcsd.update(context, 'newest'), { times: 0});
    });

    it('should do nothing when current is an error', async function () {
        td.when(bcsd.current(context)).thenReturn(new Error('current error'));
        td.when(bcsd.newest(context)).thenReturn('newest');
        clock = td.timers();

        const res = await deploy.queue(event);
        clock.tick(8001);
        expect(res).to.include('not gonna do anything');
        td.verify(bcsd.update(context, 'newest'), { times: 0});
    });

    it('should do nothing when newest is an error', async function () {
        td.when(bcsd.current(context)).thenReturn('current');
        td.when(bcsd.newest(context)).thenReturn(new Error('newest error'));
        clock = td.timers();

        const res = await deploy.queue(event);
        clock.tick(8001);
        expect(res).to.include('not gonna do anything');
        td.verify(bcsd.update(context, 'newest'), { times: 0});
    });

    describe('confirmation', () => {
        beforeEach(() => {
            clock = td.timers();
            td.when(newest(context)).thenReturn('newest');
        });

        it('should schedule an update for later', async function () {
            await deploy.queue(event);
            clock.tick(8001);
            td.verify(bcsd.update(context, 'newest'));
        });

        it('should send a restart', async function () {
            await deploy.deploy(context);
            td.verify(bcsd.restart(context));
        });

        it('should not deploy if newest is error', async function () {
            const newest = new Error('newest error');
            await deploy.deploy(context, newest);
            td.verify(bcsd.update(context, newest), { times: 0});
        });

        describe('messaging', () => {
            it('should indicate success', async function () {
                td.when(bcsd.update(context, 'newest'))
                    .thenReturn('updated');
                td.when(bcsd.restart(context))
                    .thenReturn('restarted');

                const ret = await deploy.deploy(context, 'newest', 'event');
                expect(ret).not.to.be.an('error');
                expect(ret).to.include('Successfully');
            });

            it('should indicate failure', async function () {
                td.when(bcsd.update(context, 'newest'))
                    .thenReturn(new Error('updated'));
                td.when(bcsd.restart(context))
                    .thenReturn(new Error('restarted'));

                const ret = await deploy.deploy(context, 'newest', 'event');
                expect(ret).to.be.an('error');
            });
        });
    });

    describe('cancellation', () => {
        beforeEach(() => {
            clock = td.timers();
            td.when(newest(context)).thenReturn('newest');
        });

        it('should not deploy', async function () {
            await deploy.queue(event);
            await deploy.cancel();
            clock.tick(8001);
            td.verify(bcsd.update(context, 'newest'), { times: 0});
        });

        it('should indicate there is no present restart', async function () {
            const res = await deploy.cancel();
            expect(res).to.include('nothing to cancel');
        });

        it('should confirm when successful', async function () {
            await deploy.queue(event);
            const res = await deploy.cancel();
            expect(res).to.include('cancelled');
        });
    });

    describe('expansion', () => {
        beforeEach(() => {
            td.replace(bcsd, 'getContexts');
            td.when(bcsd.getContexts()).thenReturn(['context-context', 'other-context']);
        });

        it('should try to match shorthand contexts', async () => {
            const res = await deploy.queue({ content: '.deploy c-c' });

            expect(res).not.to.include('a valid context');
            td.verify(bcsd.current('context-context'));
        });

        it('should still reject invalid contexts', async () => {
            const res = await deploy.queue({ content: '.deploy a-b' });
            expect(res).to.include('Please specify a valid context');
            td.verify(bcsd.current(), { times: 0 });
        });

        it('should display shorthand contexts', async () => {
            const res = await deploy.contexts();

            expect(res).to.equal('`context-context`|`c-c`, `other-context`|`o-c`');
        });
    });

});
