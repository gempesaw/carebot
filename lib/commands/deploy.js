import bcsd from 'bounded-context-stuff-doer';
import config from '~/lib/config';

let scheduledDeploy = null;
const timeout = 8000;
const restartMessageId = null;

async function queueDeploy(event) {
    bcsd.setConfig(config.deploy);
    const context = parseContext(event);

    const currentBuild = await bcsd.current(context);
    const newestBuild = await bcsd.newest(context);

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
\`\`\`

This build will be updated and subsequently restarted. Anyone can cancel this by issuing the \`.cancel\` command.`
                          );
}
queueDeploy.description = 'Do a build update & service restart on KMS only; accepts one argument: the name of the context, like `articles-microsite`';

async function deploy (context, newestBuild) {
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
}
cancel.description = 'Stop an impending update and service restart';

function parseContext(event) {
    const [command, context] = event.content.trim().split(/\s+/);
    return context;
}

export { queueDeploy, deploy, cancel };
