import {action, autorun, computed, observable} from 'mobx';
import {fromPromise} from 'mobx-utils';
import {Request} from '../utils/Request';
import {TextEncoder} from 'text-encoding';
import base64js from 'base64-js';
import {authTokenStore} from './AuthTokenStore';

class UserInfoStore {
    @observable user = fromPromise.resolve({});

    constructor() {
        autorun(() => {
            if (!authTokenStore.value) {
                this.user = fromPromise.resolve({});
            } else if (authTokenStore.external) {
                this.loadUser();
            }
        });
    }

    @computed
    get isAuthorized() {
        const user = this.user.value;
        return user && user.details;
    }

    @action
    loadUser() {
        this.user = fromPromise(Request.post('/api/login'));
    }

    @action
    logIn(userName, password) {
        const credentials = userName + ':' + password;
        const bytes = new TextEncoder().encode(credentials);
        const encoded = base64js.fromByteArray(bytes);

        const promise = Request.post('/api/login', undefined, 'Basic ' + encoded);
        this.user = fromPromise(promise);
    }

    @action
    logOut() {
        authTokenStore.setValue(null);
    }

    @computed
    get authorities() {
        const {authorities} = this.user.value;
        return new Set(authorities);
    }

    @computed
    get locationIdList() {
        const {locations} = this.user.value;
        return new Set(locations);
    }
}

export const userInfoStore = new UserInfoStore();