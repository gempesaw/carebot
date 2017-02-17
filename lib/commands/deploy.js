import bcsd from 'bounded-context-stuff-doer';

import config from '~/lib/config';
import { sendReply } from '~/lib/session';


let scheduledDeploy = null;
const timeout = 8000; // value in milliseconds
const restartMessageId = null;

async function queue(event) {
    if (scheduledDeploy) {
        return Promise.resolve(`One at a time; please wait a few seconds for the previous restart to complete`);
    }

    const context = parseContext(event);
    if (! bcsd.validateContext(context)) {
        return Promise.resolve(`Please specify a valid context, not \`${context}\``);
    }

    const currentBuild = await bcsd.current(context);
    const newestBuild = await bcsd.newest(context);

    if (currentBuild === newestBuild) {
        return Promise.resolve(`${outputBuilds(context, currentBuild, newestBuild)}

Uhh, seems like the newest build is already deployed; not gonna do anything.`);
    }

    if ((currentBuild instanceof Error) || (newestBuild instanceof Error)) {
        return Promise.resolve(`${outputBuilds(context, currentBuild, newestBuild)}

Something seems wrong, not gonna do anything.`);
    }

    const deployArgs = [ context, newestBuild, event ];
    scheduledDeploy = setTimeout(deploy, timeout, ...deployArgs);

    return Promise.resolve(`${outputBuilds(context, currentBuild, newestBuild)}

This build will be updated and subsequently restarted. Anyone can cancel this in the next 8 seconds by issuing the \`.cancel\` command.`
                          );
}
queue.description = 'Do a build update & service restart on KMS only; accepts one argument: the name of the context [`articles-microsite`|`slideshows-microsite`|`health-guides-microsite`].';

function outputBuilds(context, currentBuild, newestBuild) {
    return `\`\`\`
${context} Current Build: ${currentBuild}
${context} Newest Build:  ${newestBuild}
\`\`\``;
}

function setupBcsdConfig() {
    if (! config.deploy || ! config.deploy.auth) {
        return {};
    }

    const [username, password] = (new Buffer(config.deploy.auth, 'base64'))
          .toString('ascii')
          .split(':');

    return bcsd.setConfig({
        username,
        password,
        ...config.deploy
    });
}

async function deploy(context, newestBuild, event) {
    clearTimeout(scheduledDeploy);
    scheduledDeploy = null;
    let reply;
    if ((sendReply instanceof Function)) {
        reply = sendReply;
    }
    else {
        reply = console.log.bind(console);
    };

    if (newestBuild instanceof Error) {
        const message = `Eh, something went wrong? This isn't the newest build: \`${newestBuild}\``;
        reply(message);
        return message;
    }

    try {
        const updated = await bcsd.update(context, newestBuild);
        const restarted = await restart(context);
        if (!(updated instanceof Error) && !(restarted instanceof Error)) {
            const message = `Successfully updated the build \`${newestBuild}\` and queued the restart...`;
            console.log(message);
            reply(event, message);
            return message;
        }
        else {
            reply(event, `Something went wrong`);
            return new Error(`${updated}, ${restarted}`);
        }
    }
    catch (err) {
        console.log(err);
        return err;
    }
}

async function restart(context, newestBuild, event) {
    try {
        return await bcsd.restart(context);
    }
    catch (err) {
        console.log(err);
        return err;
    }
}

function cancel(event) {
    if (scheduledDeploy) {
        clearTimeout(scheduledDeploy);
        scheduledDeploy = null;
        return Promise.resolve('Okay, the update & restart has been cancelled.');
    }
    else {
        return Promise.resolve('Sorry, there is nothing to cancel right now');
    }
}
cancel.description = 'Stop the impending build update & service restart';

function parseContext(event) {
    const [command, context] = event.content.trim().split(/\s+/);
    return context;
}

function contexts(event) {
    return Promise.resolve(
        bcsd.getContexts()
            .map(it => `\`${it}\``)
            .join(', ')
    );
}
contexts.description = 'List the available contexts for deployment';

setupBcsdConfig();
export default { queue, deploy, cancel, contexts };
