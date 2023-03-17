import {action, observable, toJS} from "mobx";

const KEY = 'x-auth-token';

class AuthTokenStore {
    @observable value = JSON.parse(localStorage.getItem(KEY)) || null;
    @observable external = true;

    constructor() {
        window.addEventListener('storage', action(e => {
            if (e.key === KEY) {
                this.value = JSON.parse(e.newValue) || null;
                this.external = true;
            }
        }));
    }

    @action
    setValue(value) {
        this.value = value;
        this.external = false;
        localStorage.setItem(KEY, JSON.stringify(toJS(value)));
    }
}

export const authTokenStore = new AuthTokenStore();