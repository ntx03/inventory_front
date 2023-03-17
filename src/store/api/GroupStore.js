import {action, observable, toJS} from 'mobx';
import {fromPromise} from 'mobx-utils';
import {Request} from 'utils/Request';

export class GroupStore {
    @observable
    groupList = fromPromise.resolve([]);

    @observable
    group = fromPromise.resolve({});

    @observable
    authorityList = fromPromise.resolve([]);

    @action
    loadGroupList() {
        this.groupList = fromPromise(Request.post('/api/group/list'))
    }

    @action
    loadGroup(id) {
        this.group = fromPromise(Request.post('/api/group/get', id))
    }

    @action
    loadAuthorityList() {
        this.authorityList = fromPromise(Request.post('/api/group/authority/list'))
    }

    @action
    addGroup(group) {
        const groupList = this.groupList.value;
        const addGroup = async () => {
            const newGroup = await Request.post('/api/group/add', toJS(group));
            groupList.push(newGroup);
            return groupList
        };
        this.groupList = fromPromise(addGroup())
    }

    @action
    editGroup(group) {
        const groupList = this.groupList.value;
        const editGroup = async () => {
            await Request.post('/api/group/edit', toJS(group));
            return groupList.map(item => {
                if (item.id === group.id) {
                    return group
                }
                return item
            });
        };
        this.groupList = fromPromise(editGroup());
    };

    @action
    deleteGroup(groupId) {
        const groupList = this.groupList.value;
        const deleteGroup = async () => {
            await Request.post('/api/group/delete', {
                id: groupId
            });
            return groupList.filter(item => item.id !== groupId);
        };
        this.groupList = fromPromise(deleteGroup())
    }

}