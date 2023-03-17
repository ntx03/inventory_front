import _ from 'lodash';

export function listToMap(list, transform = _.identity) {
    const result = new Map();
    list.forEach(item => {
        result.set(item.id, transform(item));
    });
    return result;
}