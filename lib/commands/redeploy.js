import { process } from "core-worker";
import sendMessage from '~/lib/session';

export const redeploy = async function (session, event, redeployCmd = "npm run deploy", sendMessage = sendMessage) {
    try {
        sendMessage(session, event, 'Okay, attempting shutdown...');
        const result = await process(redeployCmd).death();
        return Promise.resolve(result);
    }
    catch (err) {
        return Promise.resolve(err);
    }
};
