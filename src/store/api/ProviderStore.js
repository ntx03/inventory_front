import {action, observable, toJS} from 'mobx';
import {fromPromise} from 'mobx-utils';
import {Request} from 'utils/Request';

export class ProviderStore {
    @observable
    providerList = fromPromise.resolve([]);

    @observable
    provider = fromPromise.resolve({});

    @action
    loadProviderList() {
        this.providerList = fromPromise(Request.post('/api/provider/list'))
    }

    @action
    loadProvider(id) {
        this.provider = fromPromise(Request.post('/api/provider/get', id))
    }

    @action
    addProvider(provider) {
        const providerList = this.providerList.value;
        const addProvider = async () => {
            const newProvider = await Request.post('/api/provider/add', toJS(provider));
            providerList.push(newProvider);
            return providerList
        };
        this.providerList = fromPromise(addProvider())
    }

    @action
    editProvider(provider) {
        const providerList = this.providerList.value;
        const editProvider = async () => {
            await Request.post('/api/provider/edit', toJS(provider));
            return providerList.map(item => {
                if (item.id === provider.id) {
                    return provider
                }
                return item
            });
        };
        this.providerList = fromPromise(editProvider());
    };

    @action
    deleteProvider(providerId) {
        const providerList = this.providerList.value;
        const deleteProvider = async () => {
            await Request.post('/api/provider/delete', {
                id: providerId
            });
            return providerList.filter(item => item.id !== providerId);
        };
        this.providerList = fromPromise(deleteProvider())
    }

}