import {action, observable, toJS} from "mobx";

export class SessionStore {
    @observable value = null;
    key = null;

    constructor(key = null, defaultValue = null) {
        this.key = key;

        const value = JSON.parse(sessionStorage.getItem(this.key));
        if (value == null) {
            this.value = defaultValue
        } else {
            this.value = value;
        }
    }

    @action
    setValue(value) {
        this.value = value;
        sessionStorage.setItem(this.key, JSON.stringify(toJS(value)));
    }
}