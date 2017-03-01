import fsp from 'fs-promise';
import path from 'path';
import R from 'ramda';

const sanitizeKey = (key) => key.replace(/[^A-Za-z0-9]*/g, '');
const keyToFile = (key = '') => path.join(__dirname, '../../data', key);
const decode = (buf) => buf.toString('ascii');
const catchErr = (err) => {
    console.log('hiiii', err);
    const matches = /no such file or directory, open .*\/(.*)/.test(err.message);
    if (matches && matches[1]) {
        return `Invalid key: ${matches[1]}`;
    }
    else {
        return err;
    }
};

const getFile = R.pipe(sanitizeKey, keyToFile);

const parseEvent = ({ content }) => {
    const [command, key, ...data] = content.trim().split(/\s/);
    return {
        key: sanitizeKey(key),
        file: getFile(key),
        data: data.join(' ')
    };
};

async function readBuffer({ file }) { return await fsp.readFile(file); }

const getPipe = R.pipeP(
    Promise.resolve.bind(Promise),
    parseEvent,
    R.tryCatch(readBuffer, catchErr),
    decode
);

// async function get(event, encoding = { encoding: 'utf-8'}) {
//     const { file } = parseEvent(event);
//     try {
//         return await fsp.readFile(file, encoding);
//     }
//     catch (err) {
//         console.log(err);
//         return 'Hm, something went wrong';
//     }
// };
// get.description = 'Retrieve a previously stored value';

const set = (event, encoding = { encoding: 'utf-8'}) => {
    const { key, file, data } = parseEvent(event);
    try {
        return fsp.writeFile(file, data, encoding)
            .then(() => `Okay, set "${key}"!`);
    }
    catch (err) {
        console.log(err);
        return err;
    }
};
set.description = '<key> <string> Persist a value for subsequent retrieval';

const unlink = ({ file }) => fsp.unlink(file);
const unset = R.pipeP(
    Promise.resolve.bind(Promise),
    parseEvent,
    unlink
);

const markupArray = ary => ary.map(it => `\`${it}\``).join(', ');

const getAll = R.pipeP(Promise.resolve.bind(Promise, ''), keyToFile, fsp.readdir, markupArray);


export default { get: getPipe, set, unset, getAll };
