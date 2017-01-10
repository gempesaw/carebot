import bcsd from 'bounded-context-stuff-doer';
import config from '~/lib/config';

let scheduledDeploy = null;
const timeout = 8000;
const restartMessageId = null;

async function queueDeploy(event) {
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

    const deployArgs = [ context, newestBuild ];
    scheduledDeploy = setTimeout(deploy, timeout, ...deployArgs);

    return Promise.resolve(`${outputBuilds(context, currentBuild, newestBuild)}

This build will be updated and subsequently restarted. Anyone can cancel this in the next 8 seconds by issuing the \`.cancel\` command.`
                          );
}
queueDeploy.description = 'Do a build update & service restart on KMS only; accepts one argument: the name of the context. Currently, the only valid context is `articles-microsite`.';

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

async function deploy (context, newestBuild) {
    scheduledDeploy = null;
    try {
        const updated = await bcsd.update(context, newestBuild);
        const restarted = await bcsd.restart(context);
    }
    catch (err) {
        console.log(err);
    }
}

function cancel(event) {
    clearTimeout(scheduledDeploy);
    scheduledDeploy = null;
    return Promise.resolve('Okay, the update & restart has been cancelled.');
}
cancel.description = 'Stop the impending build update & service restart';

function parseContext(event) {
    const [command, context] = event.content.trim().split(/\s+/);
    return context;
}

setupBcsdConfig();
export { queueDeploy, deploy, cancel };
