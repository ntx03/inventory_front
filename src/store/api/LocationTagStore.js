import {action, observable, toJS} from 'mobx';
import {fromPromise} from 'mobx-utils';
import {Request} from 'utils/Request';

export class LocationTagStore {
    @observable
    locationTagList = fromPromise.resolve([]);

    @observable
    locationTag = fromPromise.resolve({});

    @action
    loadLocationTagList() {
        this.locationTagList = fromPromise(Request.post('/api/location-tag/list'))
    }

    @action
    loadLocationTag(id) {
        this.locationTag = fromPromise(Request.post('/api/location-tag/get', id))
    }

    @action
    addLocationTag(locationTag) {
        const locationTagList = this.locationTagList.value;
        const addLocationTag = async () => {
            const newLocationTag = await Request.post('/api/location-tag/add', toJS(locationTag));
            locationTagList.push(newLocationTag);
            return locationTagList
        };
        this.locationTagList = fromPromise(addLocationTag())
    }

    @action
    editLocationTag(locationTag) {
        const locationTagList = this.locationTagList.value;
        const editLocationTag = async () => {
            await Request.post('/api/location-tag/edit', toJS(locationTag));
            return locationTagList.map(item => {
                if (item.id === locationTag.id) {
                    return locationTag
                }
                return item
            });
        };
        this.locationTagList = fromPromise(editLocationTag());
    };

    @action
    deleteLocationTag(locationTagId) {
        const locationTagList = this.locationTagList.value;
        const deleteLocationTag = async () => {
            await Request.post('/api/location-tag/delete', {
                id: locationTagId
            });
            return locationTagList.filter(item => item.id !== locationTagId);
        };
        this.locationTagList = fromPromise(deleteLocationTag())
    }

}