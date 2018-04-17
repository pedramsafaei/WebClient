import _ from 'lodash';
import { CONSTANTS, TIME } from '../../constants';

/* @ngInject */
function keyCache(Key) {
    const { RECIPIENT_TYPE } = CONSTANTS;
    const KEY_GET_ADDRESS_MISSING = 33102;
    const KEY_GET_ADDRESS_NO_RECEIVE = 33103;
    const TIMEOUT = 10 * TIME.MINUTE;
    const CACHE = {};

    const getKeysFromApi = (email) => {
        return Key.keys(email)
            .then(({ data }) => {
                CACHE[email] = { time: Date.now(), data: _.pick(data, 'RecipientType', 'MIMEType', 'Keys') };
                return CACHE[email].data;
            })
            .catch((err) => {
                if (err.data && err.data.Code === KEY_GET_ADDRESS_MISSING) {
                    CACHE[email] = {
                        time: Date.now(),
                        data: {
                            RecipientType: RECIPIENT_TYPE.TYPE_NO_RECEIVE,
                            MIMEType: null,
                            Keys: []
                        }
                    };
                    return CACHE[email].data;
                }

                if (err.data && err.data.Code === KEY_GET_ADDRESS_NO_RECEIVE) {
                    CACHE[email] = {
                        time: Date.now(),
                        data: {
                            RecipientType: RECIPIENT_TYPE.TYPE_NO_RECEIVE,
                            MIMEType: null,
                            Keys: []
                        }
                    };
                    return CACHE[email].data;
                }
                throw err;
            });
    };

    const getKeysPerEmail = async (email) => {
        const inCache = _.has(CACHE, email) && CACHE[email].time + TIMEOUT > Date.now();
        if (!inCache) {
            CACHE[email] = { time: Date.now(), data: getKeysFromApi(email) };
        }
        return CACHE[email].data;
    };

    const get = (emails) => {
        return Promise.all(emails.map((email) => getKeysPerEmail(email))).then((keys) => _.zipObject(emails, keys));
    };
    return { get };
}
export default keyCache;