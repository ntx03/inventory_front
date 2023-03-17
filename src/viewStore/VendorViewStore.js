import React from 'react';
import {action, computed, observable} from 'mobx';
import {SessionStore} from 'store/SessionStore';
import {authority} from 'utils/Authority';
import {WatchList} from '../utils/WatchList';
import {TextFilter} from '../utils/TextFilter';
import {filtersToFiltered, filterToColumn} from '../utils/ReactTableUtils';
import {ButtonsTableVendorComponent} from '../component/vendor/ButtonsTableVendorComponent';
import {VendorStore} from '../store/api/VendorStore';
import {copyObject} from '../utils/copyObject';

const defaultVendor = {
    name: ''
};

export class VendorViewStore {

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
        Cell: props => <ButtonsTableVendorComponent {...props}/>,
        filterable: false,
        sortable: false,
        resizable: false
    }];

    @observable
    filters = {
        name: new TextFilter('vendor.filters.name')
    };

    @computed
    get filtered() {
        return filtersToFiltered(this.filters);
    }

    pageSize = new SessionStore('vendor.pageSize', 50);

    @action
    handlePageSizeChange = size => {
        this.pageSize.setValue(size);
    };

    page = new SessionStore('vendor.page', 0);

    @action
    handlePageChange = page => {
        this.page.setValue(page);
    };

    constructor() {
        this.vendorStore = new VendorStore();
        this.vendorStore.loadVendorList();
    }

    @computed
    get stateLoad() {
        return new WatchList(
            this.vendorStore.vendorList
        )
    }

    @computed
    get vendorList() {
        const vendorList = this.vendorStore.vendorList;
        return vendorList.value;
    }

    @observable
    vendor = copyObject(defaultVendor);

    @action
    setVendorName(name) {
        this.vendor.name = name;
    }

    @computed
    get hasAuthorityAddVendor() {
        return authority.VENDOR_CREATE
    }

    @computed
    get hasAuthorityEditVendor() {
        return authority.VENDOR_UPDATE
    }

    @computed
    get hasAuthorityDeleteVendor() {
        return authority.VENDOR_DELETE
    }

    @observable
    modal = null;

    @action
    hideModal() {
        this.modal = null;
    }

    @action
    showModalAddVendor() {
        this.vendor = copyObject(defaultVendor);
        this.modal = 'EDIT';
    }

    @action
    showModalEditVendor(vendor) {
        this.vendor = copyObject(vendor);
        this.modal = 'EDIT';
    }

    @action
    handleSaveVendor() {
        if (this.vendor.id) {
            this.vendorStore.editVendor(this.vendor);
        } else {
            this.vendorStore.addVendor(this.vendor);
        }
        this.modal = null;
    }

    @action
    handleDeleteVendor(id) {
        this.vendorStore.deleteVendor(id)
    }

}