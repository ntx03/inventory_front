import React from 'react';
import {action, computed, observable} from 'mobx';
import {SessionStore} from 'store/SessionStore';
import {authority} from 'utils/Authority';
import {WatchList} from '../utils/WatchList';
import {TextFilter} from '../utils/TextFilter';
import {filtersToFiltered, filterToColumn} from '../utils/ReactTableUtils';
import {ButtonsTableHardwareTypeComponent} from '../component/hardwareType/ButtonsTableHardwareTypeComponent';
import {HardwareTypeStore} from '../store/api/HardwareTypeStore';
import {copyObject} from '../utils/copyObject';

const defaultHardwareType = {
    name: ''
};

export class HardwareTypeViewStore {

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
        Cell: props => <ButtonsTableHardwareTypeComponent {...props}/>,
        filterable: false,
        sortable: false,
        resizable: false
    }];

    @observable
    filters = {
        name: new TextFilter('hardwareType.filters.name')
    };

    @computed
    get filtered() {
        return filtersToFiltered(this.filters);
    }

    pageSize = new SessionStore('hardwareType.pageSize', 50);

    @action
    handlePageSizeChange = size => {
        this.pageSize.setValue(size);
    };

    page = new SessionStore('hardwareType.page', 0);

    @action
    handlePageChange = page => {
        this.page.setValue(page);
    };

    constructor() {
        this.hardwareTypeStore = new HardwareTypeStore();
        this.hardwareTypeStore.loadHardwareTypeList();
    }

    @computed
    get stateLoad() {
        return new WatchList(
            this.hardwareTypeStore.hardwareTypeList
        )
    }

    @computed
    get hardwareTypeList() {
        const hardwareTypeList = this.hardwareTypeStore.hardwareTypeList;
        return hardwareTypeList.value;
    }

    @observable
    hardwareType = copyObject(defaultHardwareType);

    @action
    setHardwareTypeName(name) {
        this.hardwareType.name = name;
    }

    @computed
    get hasAuthorityAddHardwareType() {
        return authority.HARDWARE_TYPE_CREATE
    }

    @computed
    get hasAuthorityEditHardwareType() {
        return authority.HARDWARE_TYPE_UPDATE
    }

    @computed
    get hasAuthorityDeleteHardwareType() {
        return authority.HARDWARE_TYPE_DELETE
    }

    @observable
    modal = null;

    @action
    hideModal() {
        this.modal = null;
    }

    @action
    showModalAddHardwareType() {
        this.hardwareType = copyObject(defaultHardwareType);
        this.modal = 'EDIT';
    }

    @action
    showModalEditHardwareType(hardwareType) {
        this.hardwareType = copyObject(hardwareType);
        this.modal = 'EDIT';
    }

    @action
    handleSaveHardwareType() {
        if (this.hardwareType.id) {
            this.hardwareTypeStore.editHardwareType(this.hardwareType);
        } else {
            this.hardwareTypeStore.addHardwareType(this.hardwareType);
        }
        this.modal = null;
    }

    @action
    handleDeleteHardwareType(id) {
        this.hardwareTypeStore.deleteHardwareType(id)
    }

}