let config = {
    name: 'flowbot',
    token: 'FLOWDOCK_KEY',
    flowdockUserId: 'flowdockUserId', // avoid responding to our own messages

    deploy: {
        base: 'https://admin-ui-domain/adminui',
        auth: 'username-and-password-joined-by-semi:and-already-base64-encoded',
        defaultBox: 'env-##.terminus...',
        debug: true
    }
};

export default config;
