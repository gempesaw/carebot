import { Session } from 'flowdock';
import config from '~/lib/config';
import { bindToFlows } from '~/lib/session';

let session = new Session(config.token);
session.flows((error, flows) => bindToFlows(session, error, flows));
session.on('error', console.log.bind(console));
