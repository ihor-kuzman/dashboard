import qs from 'qs';
import set from 'lodash/set';

export function parse(string, options = {}) {
    return qs.parse(string, { ignoreQueryPrefix: true, ...options });
}

export function parseSub(string) {
    return string.split(';').filter(Boolean).reduce((filters, filter) => {
        const [key, value] = filter.split(':');
        return { ...filters, ...set({}, key, value.split(',')) };
    }, {});
}

export function stringify(object, options = {}) {
    return qs.stringify(object, { skipNulls: true, ...options });
}

export function stringifySub(object) {
    return Object.entries(object)
        .reduce((filters, [key, value]) => (value === null ? filters : [...filters, `${key}:${value}`]), [])
        .join(':');
}
