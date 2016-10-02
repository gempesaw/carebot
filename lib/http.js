import rp from 'request-promise-native';

export default http;

function http() {
    return {
        get(uri, options) {
            if (! options) {
                return rp(uri);
            }
            else {
                options.uri = uri;
                return rp(options);
            }
        }
    };
}
