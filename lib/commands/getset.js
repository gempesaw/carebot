import fsp from 'fs-promise';
import path from 'path';
import R from 'ramda';

const sanitizeKey = (key) => key.replace(/[^A-Za-z0-9]*/g, '');
const keyToFile = (key = '') => path.join(__dirname, '../../data', key);
const decode = (buf) => buf.toString('ascii');

const getFilename = R.pipe(
    sanitizeKey,
    keyToFile
);

const parseEvent = ({ content }) => {
    const [command, key, ...data] = content.trim().split(/\s/);
    return Promise.resolve({
        key: sanitizeKey(key),
        file: getFilename(key),
        data: data.join(' ')
    });
};

const readBuffer = async ({ key, file }) => await fsp.readFile(file)
      .catch((err) => Buffer.from(`Invalid key: \`${key}\``));

const get = R.pipeP(
    parseEvent,
    readBuffer,
    decode
);
get.description = 'Retrieve a previously stored value';

const contentToGetCommand = ({ content = '' } = {}) => Promise.resolve({ content: `.get ${content.replace(/^./, '')}`});
const verifyGetData = (data) => /Invalid/.test(data) ? undefined : data;

const maybeGet = R.pipeP(
    contentToGetCommand,
    get,
    verifyGetData
);

const writeFile = async ({ key, file, data }, encoding = { encoding: 'utf-8'}) =>
      await fsp.writeFile(file, data, encoding)
      .then(() => `Okay: ${key} === ${data}`)
      .catch((err) => `Err, something went wrong: ${err.message}`);

const set = R.pipeP(
    parseEvent,
    writeFile
);

const unlink = ({ file }) => fsp.unlink(file);
const unset = R.pipeP(
    parseEvent,
    unlink
);

const getAll = R.pipeP(
    Promise.resolve.bind(Promise, ''),
    keyToFile,
    R.tryCatch(fsp.readdir, () => [])
);

export default { get, maybeGet, set, unset, getAll };
