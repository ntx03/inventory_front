import {Tag} from 'antd';
import {action, computed, observable} from 'mobx';
import React from 'react';
import {GroupStore} from 'store/api/GroupStore';
import {LocationStore} from 'store/api/LocationStore';
import {SessionStore} from 'store/SessionStore';
import {authority} from 'utils/Authority';
import {copyObject} from 'utils/copyObject';
import {IdListFilter} from 'utils/IdListFilter';
import {locationListToTree} from 'utils/locationListToLocationTreeList';
import {ButtonsTableUserComponent} from '../component/user/ButtonsTableUserComponent';
import {UserStore} from '../store/api/UserStore';
import {filtersToFiltered, filterToColumn} from '../utils/ReactTableUtils';
import {TextFilter} from '../utils/TextFilter';
import {WatchList} from '../utils/WatchList';

const defaultUser = {
    id: null,
    groupsId: [],
    locationsId: []
};

export class UserViewStore {

    columns = [{
        Header: <span title="Логин">Логин</span>,
        accessor: 'login',
        Cell: ({value}) => {
            return <span title={value}>{value}</span>
        },
        ...filterToColumn(this.filters.login)
    }, {
        Header: <span title="ФИО">ФИО</span>,
        accessor: 'name',
        Cell: ({value}) => {
            return <span title={value}>{value}</span>
        },
        ...filterToColumn(this.filters.name)
    }, {
        Header: <span title="Группы">Группы</span>,
        accessor: 'groupsId',
        Cell: ({value}) => {
            return value.map(item => {
                const group = this.groupIdToGroupMap.get(item);
                if (!group) return null;
                return <Tag key={group && group.id}>{group && group.name}</Tag>
            });
        },
        ...filterToColumn(this.filters.groupsId)
    }, {
        id: 'action',
        Header: <span title="Доступные действия">Действия</span>,
        width: 100,
        Cell: props => <ButtonsTableUserComponent {...props}/>,
        filterable: false,
        sortable: false,
        resizable: false
    }];

    @observable
    filters = {
        login: new TextFilter('user.filters.login'),
        name: new TextFilter('user.filters.name'),
        groupsId: new IdListFilter('user.filters.groupsId', () => this.groupList)
    };

    @computed
    get filtered() {
        return filtersToFiltered(this.filters);
    }

    pageSize = new SessionStore('user.pageSize', 50);

    @action
    handlePageSizeChange = size => {
        this.pageSize.setValue(size);
    };

    page = new SessionStore('user.page', 0);

    @action
    handlePageChange = page => {
        this.page.setValue(page);
    };

    constructor() {
        this.userStore = new UserStore();
        this.userStore.loadUserList();
        this.groupStore = new GroupStore();
        this.groupStore.loadGroupList();
        this.locationStore = new LocationStore();
        this.locationStore.loadLocationList();
    }

    @computed
    get stateLoad() {
        return new WatchList(
            this.userStore.userList,
            this.groupStore.groupList,
            this.locationStore.locationList
        )
    }

    @computed
    get userList() {
        const userList = this.userStore.userList;
        return userList.value;
    }

    @computed
    get groupList() {
        const groupList = this.groupStore.groupList;
        return groupList.value;
    }

    @computed
    get groupIdToGroupMap() {
        const map = new Map();
        this.groupList.forEach(item => {
            map.set(item.id, item)
        });
        return map
    }

    @computed
    get groupListToDataSource() {
        return this.groupList.map(item => {
            return {
                key: item.id,
                name: item.name
            }
        });
    }

    @computed
    get locationList() {
        const locationList = this.locationStore.locationList;
        return locationList.value;
    }

    @computed
    get treeLocationList() {
        return locationListToTree(this.locationList);
    }

    @observable
    user = copyObject(defaultUser);

    @action
    setLocationsIdUser = (locationsId) => {
        this.user.locationsId = locationsId;
    };

    @action
    setGroupsIdUser = (groupsId) => {
        this.user.groupsId = groupsId;
    };

    @computed
    get hasAuthorityChangeUserRights() {
        return authority.CHANGE_USER_RIGHTS
    }

    @observable
    modal = null;

    @action
    hideModal() {
        this.modal = null;
    }

    @action
    showEditUserGroups = (user) => {
        this.user = user;
        this.modal = 'EDIT_GROUPS';
    };

    @action
    handleSaveUserGroups = () => {
        this.userStore.addGroupsId(this.user);
        this.modal = null;
    };

    @action
    showEditUserLocations = (user) => {
        this.user = user;
        this.modal = 'EDIT_LOCATIONS';
    };

    @action
    handleSaveUserLocationsId = () => {
        this.userStore.addLocationId(this.user);
        this.modal = null;
    };

}