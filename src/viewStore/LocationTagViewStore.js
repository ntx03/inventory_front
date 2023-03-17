import React from 'react';
import {action, computed, observable} from 'mobx';
import {SessionStore} from 'store/SessionStore';
import {authority} from 'utils/Authority';
import {WatchList} from '../utils/WatchList';
import {TextFilter} from '../utils/TextFilter';
import {filtersToFiltered, filterToColumn} from '../utils/ReactTableUtils';
import {ButtonsTableLocationTagComponent} from '../component/locationTag/ButtonsTableLocationTagComponent';
import {LocationTagStore} from '../store/api/LocationTagStore';
import {copyObject} from '../utils/copyObject';

const defaultLocationTag = {
    name: ''
};

export class LocationTagViewStore {

    columns = [{
        Header: <span title="Наименование">Наименование</span>,
        accessor: 'name',
        Cell: ({value}) => {
            return <span title={value}>{value}</span>
        },
        ...filterToColumn(this.filters.name)
    }, {
        id: 'action',
        Header: <span title="Доступные действия">Действия</span>,
        width: 100,
        Cell: props => <ButtonsTableLocationTagComponent {...props}/>,
        filterable: false,
        sortable: false,
        resizable: false
    }];

    @observable
    filters = {
        name: new TextFilter('locationTag.filters.name')
    };

    @computed
    get filtered() {
        return filtersToFiltered(this.filters);
    }

    pageSize = new SessionStore('locationTag.pageSize', 50);

    @action
    handlePageSizeChange = size => {
        this.pageSize.setValue(size);
    };

    page = new SessionStore('locationTag.page', 0);

    @action
    handlePageChange = page => {
        this.page.setValue(page);
    };

    constructor() {
        this.locationTagStore = new LocationTagStore();
        this.locationTagStore.loadLocationTagList();
    }

    @computed
    get stateLoad() {
        return new WatchList(
            this.locationTagStore.locationTagList
        )
    }

    @computed
    get locationTagList() {
        const locationTagList = this.locationTagStore.locationTagList;
        return locationTagList.value;
    }

    @observable
    locationTag = defaultLocationTag;

    @action
    setLocationTagName(name) {
        this.locationTag.name = name;
    }

    @computed
    get hasAuthorityAddLocationTag() {
        return authority.SUPER_ADMIN || authority.LOCATION_TAG_CREATE
    };

    @computed
    get hasAuthorityEditLocationTag() {
        return authority.SUPER_ADMIN || authority.LOCATION_TAG_UPDATE
    };

    @computed
    get hasAuthorityDeleteLocationTag() {
        return authority.SUPER_ADMIN || authority.LOCATION_TAG_DELETE
    };

    @observable
    modal = null;

    @action
    hideModal() {
        this.modal = null;
    }

    @action
    showModalAddLocationTag() {
        this.locationTag = copyObject(defaultLocationTag);
        this.modal = 'EDIT';
    }

    @action
    showModalEditLocationTag(locationTag) {
        this.locationTag = copyObject(locationTag);
        this.modal = 'EDIT';
    }

    @action
    handleSaveLocationTag() {
        if (this.locationTag.id) {
            this.locationTagStore.editLocationTag(this.locationTag);
        } else {
            this.locationTagStore.addLocationTag(this.locationTag);
        }
        this.modal = null;
    }

    @action
    handleDeleteLocationTag(id) {
        this.locationTagStore.deleteLocationTag(id)
    }

}