import {Tag} from 'antd';
import React from 'react';
import {action, computed, observable} from 'mobx';
import {SessionStore} from 'store/SessionStore';
import {authority} from 'utils/Authority';
import {WatchList} from '../utils/WatchList';
import {TextFilter} from '../utils/TextFilter';
import {filtersToFiltered, filterToColumn} from '../utils/ReactTableUtils';
import {ButtonsTableGroupComponent} from '../component/group/ButtonsTableGroupComponent';
import {GroupStore} from '../store/api/GroupStore';
import {copyObject} from '../utils/copyObject';

const defaultGroup = {
    name: '',
    authorities: []
};

export class GroupViewStore {

    columns = [{
        Header: <span title="Наименование">Наименование</span>,
        accessor: 'name',
        Cell: ({value}) => {
            return <span title={value}>{value}</span>
        },
        ...filterToColumn(this.filters.name)
    }, {
        Header: <span title="Права">Права</span>,
        accessor: 'authorities',
        Cell: ({value}) => {
            return (
                <div className="tags">
                    {value.map(item => <Tag key={item}>{item}</Tag>)}
                </div>
            )
        },
        filterable: false,
        // ...filterToColumn(this.filters.name)
    }, {
        id: 'action',
        Header: <span title="Доступные действия">Действия</span>,
        width: 100,
        Cell: props => <ButtonsTableGroupComponent {...props}/>,
        filterable: false,
        sortable: false,
        resizable: false
    }];

    @observable
    filters = {
        name: new TextFilter('group.filters.name')
    };

    @computed
    get filtered() {
        return filtersToFiltered(this.filters);
    }

    pageSize = new SessionStore('group.pageSize', 50);

    @action
    handlePageSizeChange = size => {
        this.pageSize.setValue(size);
    };

    page = new SessionStore('group.page', 0);

    @action
    handlePageChange = page => {
        this.page.setValue(page);
    };

    constructor() {
        this.groupStore = new GroupStore();
        this.groupStore.loadGroupList();
        this.groupStore.loadAuthorityList();
    }

    @computed
    get stateLoad() {
        return new WatchList(
            this.groupStore.groupList,
            this.groupStore.authorityList
        )
    }

    @computed
    get groupList() {
        const groupList = this.groupStore.groupList;
        return groupList.value;
    }

    @computed
    get authorityList() {
        const authorityList = this.groupStore.authorityList;
        return authorityList.value;
    }

    @computed
    get authorityListToDataSource() {
        return this.authorityList.map(key => {
            return {key}
        });
    }

    @observable
    group = copyObject(defaultGroup);

    @action
    setGroupName(name) {
        this.group.name = name;
    }

    @action
    setAuthoritiesGroup(authorities) {
        this.group.authorities = authorities;
    }

    @computed
    get hasAuthorityAddGroup() {
        return authority.SUPER_ADMIN || authority.GROUP_CREATE
    };

    @computed
    get hasAuthorityEditGroup() {
        return authority.SUPER_ADMIN || authority.GROUP_UPDATE
    };

    @computed
    get hasAuthorityDeleteGroup() {
        return authority.SUPER_ADMIN || authority.GROUP_DELETE
    };

    @observable
    modal = null;

    @action
    hideModal() {
        this.modal = null;
    }

    @action
    showModalAddGroup() {
        this.group = copyObject(defaultGroup);
        this.modal = 'EDIT';
    }

    @action
    showModalEditGroup(group) {
        this.group = copyObject(group);
        this.modal = 'EDIT';
    }

    @action
    handleSaveGroup() {
        const group = copyObject(this.group);
        if (this.group.id) {
            this.groupStore.editGroup(group);
        } else {
            this.groupStore.addGroup(group);
        }
        this.modal = null;
    }

    @action
    handleDeleteGroup(id) {
        this.groupStore.deleteGroup(id)
    }

}