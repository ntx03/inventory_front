import {action, observable} from 'mobx';
import {fromPromise} from 'mobx-utils';
import {Request} from 'utils/Request';

export class LocationTypeStore {
    @observable
    locationTypeList = fromPromise.resolve([]);

    @action
    loadLocationTypeList() {
        this.locationTypeList = fromPromise(Request.post('/api/location-type/list'))
    }

}