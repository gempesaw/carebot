import { Session } from 'flowdock';
import searchJira from './jira';

let session = new Session('');

session.flows((error, flows) => {
    let openFlowIds = flows
        .filter(({ open }) => open)
        .map(({ id }) => id);

    let stream = session.stream(openFlowIds);
    stream.on('message', searchJira);
});
