import {action, observable} from 'mobx';
import {fromPromise} from 'mobx-utils';
import {Request} from 'utils/Request';

export class UserStore {
    @observable
    userList = fromPromise.resolve([]);

    @observable
    user = fromPromise.resolve({});

    @action
    loadUserList() {
        this.userList = fromPromise(Request.post('/api/user/list'))
    }

    @action
    loadUser(id) {
        this.user = fromPromise(Request.post('/api/user/get', id))
    }

    @action
    addGroupsId({id, groupsId}) {
        const userList = this.userList.value;
        const editUser = async () => {
            const editUser =  await Request.post('/api/user/group/add', {id, groupsId});
            return userList.map(item => {
                if (item.id === id) {
                    return editUser
                }
                return item
            });
        };
        this.userList = fromPromise(editUser())
    }

    @action
    addLocationId({id, locationsId}) {
        const userList = this.userList.value;
        const editUser = async () => {
            const editUser = await Request.post('/api/user/locations/add', {id, locationsId});
            return userList.map(item => {
                if (item.id === id) {
                    return editUser
                }
                return item
            });
        };
        this.userList = fromPromise(editUser());
    };

}