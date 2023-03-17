import {action, observable, toJS} from 'mobx';
import {fromPromise} from 'mobx-utils';
import {Request} from 'utils/Request';

export class LocationStore {
    @observable
    locationList = fromPromise.resolve([]);

    @observable
    location = fromPromise.resolve({});

    @action
    loadLocationList() {
        this.locationList = fromPromise(Request.post('/api/location/list'))
    }

    @action
    loadLocation(id) {
        this.location = fromPromise(Request.post('/api/location/get', id))
    }

    @action
    addLocation(location) {
        const locationList = this.locationList.value;
        const addLocation = async () => {
            const response = await Request.post('/api/location/add', toJS(location));
            locationList.push(response);
            return locationList
        };
        this.locationList = fromPromise(addLocation());
    }

    @action
    editLocation(location) {
        const locationList = this.locationList.value;
        const editLocation = async () => {
            const response = await Request.post('/api/location/edit', toJS(location));
            return locationList.map(item => {
                if (item.id === location.id) {
                    return response
                }
                return item
            });
        };
        this.locationList = fromPromise(editLocation());
    };

    @action
    deleteLocation(locationId) {
        const locationList = this.locationList.value;
        const deleteLocation = async () => {
            await Request.post('/api/location/delete', {
                id: locationId
            });
            return locationList.filter(item => item.id !== locationId);
        };
        this.locationList = fromPromise(deleteLocation())
    }

}