import React from 'react';
import {action, computed, observable} from 'mobx';
import {SessionStore} from 'store/SessionStore';
import {authority} from 'utils/Authority';
import {WatchList} from '../utils/WatchList';
import {TextFilter} from '../utils/TextFilter';
import {filtersToFiltered, filterToColumn} from '../utils/ReactTableUtils';
import {ButtonsTableStateComponent} from '../component/state/ButtonsTableStateComponent';
import {StateStore} from '../store/api/StateStore';
import {copyObject} from '../utils/copyObject';

const defaultState = {
    name: ''
};

export class StateViewStore {

    columns = [{
        Header: <span title="Наименование">Наименование</span>,
        accessor: 'name',
        Cell: ({value}) => {
            return <span title={value}>{value}</span>
        },
        ...filterToColumn(this.filters.name)
    }, {
        id: 'action',
        Header: <span title="Действия">Действия</span>,
        width: 100,
        Cell: props => <ButtonsTableStateComponent {...props}/>,
        filterable: false,
        sortable: false,
        resizable: false
    }];

    @observable
    filters = {
        name: new TextFilter('state.filters.name')
    };

    @computed
    get filtered() {
        return filtersToFiltered(this.filters);
    }

    pageSize = new SessionStore('state.pageSize', 50);

    @action
    handlePageSizeChange = size => {
        this.pageSize.setValue(size);
    };

    page = new SessionStore('state.page', 0);

    @action
    handlePageChange = page => {
        this.page.setValue(page);
    };

    constructor() {
        this.stateStore = new StateStore();
        this.stateStore.loadStateList();
    }

    @computed
    get stateLoad() {
        return new WatchList(
            this.stateStore.stateList
        )
    }

    @computed
    get stateList() {
        const stateList = this.stateStore.stateList;
        return stateList.value;
    }

    @observable
    state = copyObject(defaultState);

    @action
    setStateName(name) {
        this.state.name = name;
    }

    @computed
    get hasAuthorityAddState() {
        return authority.STATE_CREATE
    }

    @computed
    get hasAuthorityEditState() {
        return authority.STATE_UPDATE
    }

    @computed
    get hasAuthorityDeleteState() {
        return authority.STATE_DELETE
    }

    @observable
    modal = null;

    @action
    hideModal() {
        this.modal = null;
    }

    @action
    showModalAddState() {
        this.state = copyObject(defaultState);
        this.modal = 'EDIT';
    }

    @action
    showModalEditState(state) {
        this.state = copyObject(state);
        this.modal = 'EDIT';
    }

    @action
    handleSaveState() {
        if (this.state.id) {
            this.stateStore.editState(this.state);
        } else {
            this.stateStore.addState(this.state);
        }
        this.modal = null;
    }

    @action
    handleDeleteState(id) {
        this.stateStore.deleteState(id)
    }

}