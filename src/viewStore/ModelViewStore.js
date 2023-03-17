import React from 'react';
import {action, computed, observable} from 'mobx';
import {SessionStore} from 'store/SessionStore';
import {authority} from 'utils/Authority';
import {WatchList} from '../utils/WatchList';
import {TextFilter} from '../utils/TextFilter';
import {filtersToFiltered, filterToColumn} from '../utils/ReactTableUtils';
import {ButtonsTableModelComponent} from '../component/model/ButtonsTableModelComponent';
import {ModelStore} from '../store/api/ModelStore';
import {VendorStore} from '../store/api/VendorStore';
import {HardwareTypeStore} from '../store/api/HardwareTypeStore';
import {IdFilter} from '../utils/IdFilter';
import {BooleanFilter} from '../utils/BooleanFilter';
import {copyObject} from '../utils/copyObject';

const defaultModel = {
    vendorId: '',
    name: '',
    hardwareTypeId: '',
    consumable: false
};

export class ModelViewStore {

    columns = [{
        Header: <span title="Производитель">Производитель</span>,
        accessor: 'vendorId',
        Cell: ({value}) => {
            const vendor = this.vendorList.find(item => item.id === value);
            return <span title={vendor.name}>{vendor.name}</span>
        },
        ...filterToColumn(this.filters.vendorId)
    }, {
        Header: <span title="Модель">Модель</span>,
        accessor: 'name',
        Cell: ({value}) => {
            return <span title={value}>{value}</span>
        },
        ...filterToColumn(this.filters.name)
    }, {
        Header: <span title="Тип">Тип</span>,
        accessor: 'hardwareTypeId',
        Cell: ({value}) => {
            const hardwareType = this.hardwareTypeList.find(item => item.id === value);
            return <span title={hardwareType.name}>{hardwareType.name}</span>
        },
        ...filterToColumn(this.filters.hardwareTypeId)
    }, {
        Header: <span title="Тип модели">Тип модели</span>,
        accessor: 'consumable',
        Cell: props => props.value ? <span title="Расходник">Расходник</span> :
            <span title="Оборудование">Оборудование</span>,
        ...filterToColumn(this.filters.consumable)
    }, {
        id: 'action',
        Header: <span title="Доступные действия">Действия</span>,
        width: 100,
        Cell: props => <ButtonsTableModelComponent {...props}/>,
        filterable: false,
        sortable: false,
        resizable: false
    }];

    @observable
    filters = {
        vendorId: new IdFilter('model.filters.vendorId', () => this.vendorList),
        name: new TextFilter('model.filters.name'),
        hardwareTypeId: new IdFilter('model.filters.hardwareTypeId', () => this.hardwareTypeList),
        consumable: new BooleanFilter('model.filters.consumable', 'Расходник', 'Оборудование')
    };

    @computed
    get filtered() {
        return filtersToFiltered(this.filters);
    }

    pageSize = new SessionStore('model.pageSize', 50);

    @action
    handlePageSizeChange = size => {
        this.pageSize.setValue(size);
    };

    page = new SessionStore('model.page', 0);

    @action
    handlePageChange = page => {
        this.page.setValue(page);
    };

    constructor() {
        this.modelStore = new ModelStore();
        this.modelStore.loadModelList();
        this.vendorStore = new VendorStore();
        this.vendorStore.loadVendorList();
        this.hardwareTypeStore = new HardwareTypeStore();
        this.hardwareTypeStore.loadHardwareTypeList();
    }

    @computed
    get stateLoad() {
        return new WatchList(
            this.modelStore.modelList,
            this.vendorStore.vendorList,
            this.hardwareTypeStore.hardwareTypeList
        )
    }

    @computed
    get modelList() {
        const modelList = this.modelStore.modelList;
        return modelList.value;
    }

    @computed
    get vendorList() {
        const vendorList = this.vendorStore.vendorList;
        return vendorList.value;
    }

    @computed
    get hardwareTypeList() {
        const hardwareTypeList = this.hardwareTypeStore.hardwareTypeList;
        return hardwareTypeList.value;
    }

    @observable
    model = copyObject(defaultModel);

    @action
    setModelVendorId(id) {
        this.model.vendorId = id;
    }

    @action
    setModelName(name) {
        this.model.name = name;
    }

    @action
    setModelHardwareTypeId(id) {
        this.model.hardwareTypeId = id;
    }

    @action
    setModelConsumable(consumable) {
        this.model.consumable = consumable;
    }

    @computed
    get hasAuthorityAddModel() {
        return authority.SUPER_ADMIN || authority.MODEL_CREATE
    };

    @computed
    get hasAuthorityEditModel() {
        return authority.SUPER_ADMIN || authority.MODEL_UPDATE
    };

    @computed
    get hasAuthorityDeleteModel() {
        return authority.SUPER_ADMIN || authority.MODEL_DELETE
    };

    @observable
    modal = null;

    hideModal() {
        this.modal = null;
    }

    @action
    showModalAddModel() {
        this.model = copyObject(this.model);
        delete this.model.id;
        this.model.name = '';
        this.modal = 'EDIT';
    }

    @action
    showModalEditModel(model) {
        this.model = copyObject(model);
        this.modal = 'EDIT';
    }

    @action
    handleSaveModel() {
        if (this.model.id) {
            this.modelStore.editModel(copyObject(this.model));
        } else {
            this.modelStore.addModel(copyObject(this.model));
        }
        this.modal = null;
    }

    @action
    handleDeleteModel(id) {
        this.modelStore.deleteModel(id);
    }

}