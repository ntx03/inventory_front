import {PENDING, REJECTED} from 'mobx-utils/lib/mobx-utils';
import {computed} from 'mobx';

export class WatchList {
    constructor(...args) {
        this.list = args;
    }

    @computed
    get pending() {
        const pending = this.list.filter(e => e.state === PENDING);
        if (pending.length === 0) {
            return null;
        }
        return pending;
    }

    @computed
    get errors() {
        const errors = this.list.filter(e => e.state === REJECTED);
        if (errors.length === 0) {
            return null;
        }

        return errors;
    }
}