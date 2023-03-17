import _ from 'lodash'
import {toJS} from 'mobx';

export const copyObject = (object) => {
    return _.cloneDeep(toJS(object))
};