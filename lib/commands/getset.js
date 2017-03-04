import fsp from 'fs-promise';
import path from 'path';
import R from 'ramda';

const sanitizeData = (_ = '') => _.replace(/^[^A-Za-z0-9`]+/, '').replace(/^\.+/, '');
const sanitizeKey = (key) => key.replace(/[^A-Za-z0-9]*/g, '');
const keyToFile = (key = '') => path.join(__dirname, '../../data', key);
const decode = (buf) => buf.toString('ascii');

const getFilename = R.pipe(
    sanitizeKey,
    keyToFile
);

// returns a promise because it starts off pipeP chains
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
// FlowdockEvent -> Promise[String]
const get = R.pipeP(
    parseEvent,
    readBuffer,
    decode,
    sanitizeData
);
get.description = 'Retrieve a previously stored value';

const contentToGetCommand = ({ content = '' } = {}) => Promise.resolve({ content: `.get ${content.substring(1)}`});
const verifyGetData = (data) => /Invalid/.test(data) ? undefined : data;

// FlowdockEvent -> Either[Promise[String], Promise[undefined]]
const maybeGet = R.pipeP(
    contentToGetCommand,
    get,
    verifyGetData
);

const sanitizeEventData = ({ key, file, data}) => ({ key, file, data: sanitizeData(data) });
const writeFile = async ({ key, file, data }, encoding = { encoding: 'utf-8'}) =>
      await fsp.writeFile(file, data || '``', encoding)
      .then(() => `Okay: \`${key}\` === \`${data}\``)
      .catch((err) => `Err, something went wrong: ${err.message}`);
// FlowdockEvent -> Promise[String]
const set = R.pipeP(
    parseEvent,
    sanitizeEventData,
    writeFile
);
set.description = '`.set userKey userValue` - create a user-defined command for flowbot. Keys are are not protected from overwriting; values must start with alphanumeric char.';

const unlink = ({ key, file }) => fsp.unlink(file)
      .then(() => `Okay, \`${key}\` deleted`)
      .catch((err) => {
          console.log(err);
          return `Err, something went wrong: \`${key}\``;
      });
// FlowdockEvent -> Promise[String]
const unset = R.pipeP(
    parseEvent,
    unlink
);
unset.description = '`.unset userKey` - delete a previously defined user key';

const getAll = R.pipeP(
    Promise.resolve.bind(Promise, ''),
    keyToFile,
    R.tryCatch(fsp.readdir, () => [])
);

export default { get, maybeGet, set, unset, getAll };
