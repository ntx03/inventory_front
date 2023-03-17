import React from 'react';
import {action, computed, observable} from 'mobx';
import {SessionStore} from 'store/SessionStore';
import {authority} from 'utils/Authority';
import {WatchList} from '../utils/WatchList';
import {TextFilter} from '../utils/TextFilter';
import {filtersToFiltered, filterToColumn} from '../utils/ReactTableUtils';
import {ButtonsTableProviderComponent} from '../component/provider/ButtonsTableProviderComponent';
import {ProviderStore} from '../store/api/ProviderStore';
import {copyObject} from '../utils/copyObject';

const defaultProvider = {
    name: ''
};

export class ProviderViewStore {

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
        Cell: props => <ButtonsTableProviderComponent {...props}/>,
        filterable: false,
        sortable: false,
        resizable: false
    }];

    @observable
    filters = {
        name: new TextFilter('provider.filters.name')
    };

    @computed
    get filtered() {
        return filtersToFiltered(this.filters);
    }

    pageSize = new SessionStore('provider.pageSize', 50);

    @action
    handlePageSizeChange = size => {
        this.pageSize.setValue(size);
    };

    page = new SessionStore('provider.page', 0);

    @action
    handlePageChange = page => {
        this.page.setValue(page);
    };

    constructor() {
        this.providerStore = new ProviderStore();
        this.providerStore.loadProviderList();
    }

    @computed
    get stateLoad() {
        return new WatchList(
            this.providerStore.providerList
        )
    }

    @computed
    get providerList() {
        const providerList = this.providerStore.providerList;
        return providerList.value;
    }

    @observable
    provider = copyObject(defaultProvider);

    @action
    setProviderName(name) {
        this.provider.name = name;
    }

    @computed
    get hasAuthorityAddProvider() {
        return authority.PROVIDER_CREATE
    }

    @computed
    get hasAuthorityEditProvider() {
        return authority.PROVIDER_UPDATE
    }

    @computed
    get hasAuthorityDeleteProvider() {
        return authority.PROVIDER_DELETE
    }

    @observable
    modal = null;

    @action
    hideModal() {
        this.modal = null;
    }

    @action
    showModalAddProvider() {
        this.provider = copyObject(defaultProvider);
        this.modal = 'EDIT';
    }

    @action
    showModalEditProvider(provider) {
        this.provider = copyObject(provider);
        this.modal = 'EDIT';
    }

    @action
    handleSaveProvider() {
        if (this.provider.id) {
            this.providerStore.editProvider(this.provider);
        } else {
            this.providerStore.addProvider(this.provider);
        }
        this.modal = null;
    }

    @action
    handleDeleteProvider(id) {
        this.providerStore.deleteProvider(id)
    }

}