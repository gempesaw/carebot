let config = {
    // required
    token: 'FLOWDOCK_TOKEN', // a flowdock api token for your user

    // optional
    name: 'flowbot',
    flowdockUserId: 'flowdockUserId',
    jira: {
        host: 'jiraHost', // the base url of a JIRA instance
        auth: 'jiraAuth'
    }
};

export default config;
