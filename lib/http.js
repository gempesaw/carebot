import rp from 'request-promise-native';

const get = (uri, options) => {
    if (! options) {
        return rp(uri);
    }
    else {
        return rp({ ...options, uri });
    }
};

export default { get };
