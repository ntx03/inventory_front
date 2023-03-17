import {action, computed, observable} from 'mobx';
import React from 'react';
import {ConsignmentStore} from 'store/api/ConsignmentStore';
import {HardwareTypeStore} from 'store/api/HardwareTypeStore';
import {ConsumablesStore} from 'store/api/ConsumablesStore';
import {SessionStore} from 'store/SessionStore';
import {userInfoStore} from 'store/UserInfoStore';
import {authority} from 'utils/Authority';
import {modals} from 'utils/ModalName';
import {ButtonsTableConsumablesComponent} from '../component/consumables/ButtonsTableConsumablesComponent';
import {LocationStore} from '../store/api/LocationStore';
import {ModelStore} from '../store/api/ModelStore';
import {StateStore} from '../store/api/StateStore';
import {VendorStore} from '../store/api/VendorStore';
import {copyObject} from '../utils/copyObject';
import {IdFilter} from '../utils/IdFilter';
import {locationListToTree} from '../utils/locationListToLocationTreeList';
import {filtersToFiltered, filterToColumn} from '../utils/ReactTableUtils';
import {TextFilter} from '../utils/TextFilter';
import {WatchList} from '../utils/WatchList';
import {listToMap} from 'utils/Collections';
import {LocationFilter} from "utils/LocationFilter";

const defaultConsumables = {
    description: '',
    modelId: '',
    locationId: '',
    stateId: '',
    consignmentId: null,
    comment: '',
    count: 0
};

export class ConsumablesViewStore {

    constructor() {
        this.consumablesStore = new ConsumablesStore();
        this.consumablesStore.loadConsumablesList();
        this.modelStore = new ModelStore();
        this.modelStore.loadModelList();
        this.vendorStore = new VendorStore();
        this.vendorStore.loadVendorList();
        this.locationStore = new LocationStore();
        this.locationStore.loadLocationList();
        this.stateStore = new StateStore();
        this.stateStore.loadStateList();
        this.consignmentStore = new ConsignmentStore();
        this.hardwareTypeStore = new HardwareTypeStore();
        this.hardwareTypeStore.loadHardwareTypeList();

        this.pageSize = new SessionStore('consumables.pageSize', 50);
        this.page = new SessionStore('consumables.page', 0);
    }

    @computed
    get filters() {
        // Кэшируем данные для фильтров (хак для MobX)
        const modelIdToModelMap = this.modelIdToModelMap;
        const modelIdToVendorMap = this.modelIdToVendorMap;
        return {
            modelId: new TextFilter('consumables.filters.modelId', modelId => {
                const model = modelIdToModelMap.get(modelId);
                return model && model.name;
            }),
            description: new TextFilter('consumables.filters.description'),
            stateId: new IdFilter('consumables.filters.stateId', () => this.stateList),
            vendorId: new IdFilter('consumables.filters.vendorId', () => this.vendorList,
                modelId => {
                    const vendor = modelIdToVendorMap.get(modelId);
                    return vendor && vendor.id;
                }),
            hardwareTypeId: new IdFilter('consumables.filters.hardwareType', () => this.hardwareTypeList,
                modelId => {
                    const hardwareType = this.modelIdToHardwareTypeMap.get(modelId);
                    return hardwareType && hardwareType.id;
                }),
            accountablePerson: new TextFilter('consumables.filters.accountablePerson', user => user.name),
            locationId: new LocationFilter('equipment.filters.location', this.locationListToTree,
                (locationId)=>{
                    if(locationId){
                        this.handleSelectedConsumablesLocationId(locationId);
                        return
                    }
                    this.handleSelectedConsumablesLocationId('root');
                }),
        };
    }

    @computed
    get filtered() {
        return filtersToFiltered(this.filters);
    }

    @action
    handlePageSizeChange = size => {
        this.pageSize.setValue(size);
    };

    @action
    handlePageChange = page => {
        this.page.setValue(page);
    };

    @computed
    get columns() {
        return [{
            id: 'vendorId',
            Header: <span title="Производитель">Производитель</span>,
            accessor: 'modelId',
            Cell: ({value}) => {
                const vendor = this.modelIdToVendorMap.get(value);
                const title = vendor && vendor.name;
                return <span title={title}>{title}</span>;
            },
            ...filterToColumn(this.filters.vendorId)
        }, {
            id: 'modelId',
            Header: <span title="Модель">Модель</span>,
            accessor: 'modelId',
            Cell: ({value}) => {
                const model = this.modelIdToModelMap.get(value);
                const title = model && model.name;
                return <span title={title}>{title}</span>;
            },
            ...filterToColumn(this.filters.modelId)
        }, {
            id: 'hardwareTypeId',
            Header: <span title="Тип">Тип</span>,
            accessor: 'modelId',
            Cell: ({value}) => {
                const hardwareType = this.modelIdToHardwareTypeMap.get(value);
                const title = hardwareType && hardwareType.name;
                return <span title={title}>{title}</span>;
            },
            ...filterToColumn(this.filters.hardwareTypeId)
        }, {
            Header: <span title="Местоположение">Местоположение</span>,
            accessor: 'locationId',
            Cell: ({value}) => {
                const location = this.locationIdToLocationMap.get(value);
                const fullLocation = this.getFullNameLocation(location, []);
                const title = location && fullLocation;
                return <span title={title}>{title}</span>;
            },
            ...filterToColumn(this.filters.locationId)
        }, {
            Header: <span title="Количество">Кол-во</span>,
            accessor: 'count',
            width: 70,
            Cell: ({value}) => {
                return <span title={value}>{value}</span>
            },
            filterable: false
        }, {
            Header: <span title="Состояние">Состояние</span>,
            accessor: 'stateId',
            Cell: ({value}) => {
                const state = this.stateIdToStateMap.get(value);
                const title = state && state.name;
                return <span title={title}>{title}</span>;
            },
            ...filterToColumn(this.filters.stateId)
        }, {
            Header: <span title="Материально ответственный">Ответственный</span>,
            accessor: 'accountablePerson',
            Cell: ({value}) => {
                return <span title={value.name}>{value.name}</span>;
            },
            ...filterToColumn(this.filters.accountablePerson)
        }, {
            Header: <span title="Описание">Описание</span>,
            accessor: 'description',
            Cell: ({value}) => {
                return <span title={value}>{value}</span>
            },
            ...filterToColumn(this.filters.description)
        }, {
            id: 'action',
            Header: <span title="Доступные действия">Действия</span>,
            Cell: props => <ButtonsTableConsumablesComponent {...props}/>,
            width: 100,
            filterable: false,
            sortable: false,
            resizable: false
        }];
    }

    @computed
    get counts() {
        return {
            allRecords: this.consumablesList.length,
            currentRecords: this.filteredConsumablesList.length,
            // selectedRecords: this.selectedEquipmentMap.size
        };
    }

    @computed
    get stateLoad() {
        return new WatchList(
            this.consumablesStore.consumablesList,
            this.modelStore.modelList,
            this.vendorStore.vendorList,
            this.hardwareTypeStore.hardwareTypeList,
            this.locationStore.locationList,
            this.stateStore.stateList
        );
    }

    @computed
    get stateLoadConsignmentCreatedList() {
        return new WatchList(
            this.consignmentStore.consignmentCreatedList
        );
    }

    @computed
    get consumablesList() {
        const consumablesList = this.consumablesStore.consumablesList;
        return consumablesList.value;
    }

    @computed
    get modelList() {
        const modelList = this.modelStore.modelList;
        return modelList.value.filter(item => item.consumable);
    }

    @computed
    get modelIdToModelMap() {
        return listToMap(this.modelList);
    }

    @computed
    get modelIdToVendorMap() {
        const modelToVendor = model => this.vendorIdToVendorMap.get(model.vendorId);
        return listToMap(this.modelList, modelToVendor);
    }

    @computed
    get hardwareTypeList() {
        const hardwareTypeList = this.hardwareTypeStore.hardwareTypeList;
        return hardwareTypeList.value;
    }

    @computed
    get hardwareIdToHardware() {
        return listToMap(this.hardwareTypeList);
    }

    @computed
    get modelIdToHardwareTypeMap() {
        const modelToHardwareType = model => this.hardwareIdToHardware.get(model.hardwareTypeId);
        return listToMap(this.modelList, modelToHardwareType);
    }

    @computed
    get vendorList() {
        const vendorList = this.vendorStore.vendorList;
        return vendorList.value;
    }

    @computed
    get vendorIdToVendorMap() {
        return listToMap(this.vendorList);
    }

    @computed
    get locationList() {
        const locationList = this.locationStore.locationList;
        return locationList.value;
    }

    @computed
    get locationIdToLocationMap() {
        return listToMap(this.locationList);
    }

    @computed
    get stateList() {
        const stateList = this.stateStore.stateList;
        return stateList.value;
    }

    @computed
    get stateIdToStateMap() {
        return listToMap(this.stateList);
    }

    @computed
    get contractList() {
        const contractList = this.contractStore.contractList;
        return contractList.value;
    }

    @computed
    get consignmentCreatedList() {
        const consignmentCreatedList = this.consignmentStore.consignmentCreatedList;
        return consignmentCreatedList.value;
    }

    @computed
    get consignmentIdToConsignmentMap() {
        return listToMap(this.consignmentCreatedList);
    }

    @observable
    consumables = copyObject(defaultConsumables);

    @action
    setConsumablesModelId(modelId) {
        this.consumables.modelId = modelId;
    }

    @action
    setConsumableDescription(description) {
        this.consumables.description = description;
    }

    @action
    setConsumablesLocationId(locationId) {
        this.consumables.locationId = locationId;
    }

    @action
    setConsumablesStateId(stateId) {
        this.consumables.stateId = stateId;
    }

    @action
    setConsumablesConsignmentId(consignmentId) {
        this.consumables.consignmentId = consignmentId;
    }

    @action
    setConsumablesCount(count) {
        this.consumables.count = count;
    }

    //Провеверяем права на местоположение.
    hasAuthorityLocationId(locationId) {
        const location = this.locationIdToLocationMap.get(locationId);
        if (!location) return false;
        return userInfoStore.locationIdList.has(location.id) || this.hasAuthorityLocationId(location.parentId);
    }

    @computed
    get hasAuthorityAddConsumables() {
        return authority.SUPER_ADMIN || authority.CONSUMABLES_CREATE;
    };

    hasAuthorityMoveConsumables = ({locationId, consignment}) => {
        return !consignment &&
            (
                authority.SUPER_ADMIN ||
                authority.HARDWARE_MOVE && this.hasAuthorityLocationId(locationId) ||
                authority.ANOTHERS_HARDWARE_MOVE
            );
    };

    hasAuthorityChangeStateConsumables = ({locationId}) => {
        return authority.SUPER_ADMIN || authority.CONSUMABLES_CHANGE_STATE && this.hasAuthorityLocationId(locationId);
    };

    hasAuthorityEditConsumables = ({locationId}) => {
        return authority.SUPER_ADMIN || authority.CONSUMABLES_UPDATE && this.hasAuthorityLocationId(locationId);
    };

    hasAuthorityDeleteConsumables = ({locationId, consignment}) => {
        return !consignment &&
            (authority.SUPER_ADMIN || authority.CONSUMABLES_DELETE && this.hasAuthorityLocationId(locationId));
    };

    @observable
    modal = null;

    @action
    hideModal() {
        this.modal = null;
    }

    @action
    showModalAddConsumables() {
        this.consumables = copyObject(this.consumables);
        delete this.consumables.id;
        this.consumables.description = '';
        this.consumables.count = 0;
        this.modal = modals.ModalEditConsumables;
    }

    @action
    showModalEditConsumables(consumables) {
        this.consumables = copyObject(consumables);
        this.modal = modals.ModalEditConsumables;
    }

    @action
    showModalChangeStateConsumables({id}) {
        this.consumables = copyObject({id, count: 0, stateId: '', comment: ''});
        this.modal = modals.ModalChangeStateConsumables;
    }

    @action
    showModalEditConsignmentConsumables({id, consignmentId}) {
        this.consumables = copyObject({consumablesId: id, consignmentId, count: 0});
        this.consignmentStore.loadConsignmentCreatedList();
        this.modal = modals.ModalEditConsignmentConsumables;
    }

    @action
    handleSaveConsumables() {
        const consumables = copyObject(this.consumables);
        if (consumables.id) {
            this.consumablesStore.editConsumables(consumables);
        } else {
            this.consumablesStore.addConsumables(consumables);
        }
        this.modal = null;
    }

    @action
    handleSaveChangeStateConsumables() {
        const consumables = copyObject(this.consumables);
        this.consumablesStore.changeStateConsumables(consumables);
        this.modal = null;
    }

    @action
    handleSaveEditConsignmentConsumables() {
        const consumables = copyObject(this.consumables);
        this.consumablesStore.editConsignmentConsumables(consumables);
        this.modal = null;
    }

    @action
    handleDeleteConsumables(id) {
        this.consumablesStore.deleteConsumables(id);
    }

    @action
    handleRemoveConsignmentConsumables({id, consignmentId, count}) {
        this.consumablesStore.removeConsignmentConsumables({consumablesId: id, consignmentId, count});
        this.modal = null;
    }

    @observable
    selectedConsumablesLocationId = 'root';

    @action
    handleSelectedConsumablesLocationId(locationId) {
        if (locationId) {
            this.selectedConsumablesLocationId = locationId;
            if (!this.expandedKeys.includes(locationId)) {
                this.expandedKeys.push(locationId);
            }
        }
    }

    @observable //Массив развернутых(TreeNode) местоположений.
    expandedKeys = ['root'];

    @observable //Нужно ли автоматически разворачивать Tree.
    autoExpandParent = false;

    @action
    setExpandedKeys(expandedKeys, autoExpandParent) {
        this.autoExpandParent = autoExpandParent;
        this.expandedKeys = expandedKeys;
    }

    @observable //Список id местоположений в которых нашли текст который ищем.
    locationIdListBySearchValue = [];

    @action
    setLocationIdListBySearchValue(value) {
        const expandedKeys = ['root'];
        if (value) {
            const searchText = value.toLowerCase();
            this.locationList.forEach(item => {
                const str = item.name.toLowerCase();
                if (str.includes(searchText)) {
                    expandedKeys.push(item.id);
                }
            });
            this.locationIdListBySearchValue = expandedKeys;
            this.setExpandedKeys(expandedKeys, true);
        } else {
            this.setExpandedKeys(['root'], false);
            this.locationIdListBySearchValue = [];
        }
    }

    //Получить список для отрисовки дерева.
    @computed
    get locationListToTree() {
        return locationListToTree(this.locationList);
    }

    @computed
    get locationIdToFilteredLocationIdList() {
        return listToMap(this.locationList, l => this.getAllChildrenByLocationId(l.id));
    }

    getAllChildrenByLocationId(id) {
        const allChildren = [];
        const children = this.locationList.filter(l => l.parentId === id);
        children.forEach(l => {
            const list = this.getAllChildrenByLocationId(l.id);
            allChildren.push(...list);
        });
        allChildren.push(id);
        return allChildren;
    }

    @computed
    get filteredConsumablesList() {
        if (this.selectedConsumablesLocationId === 'root') {
            return this.consumablesList;
        } else {
            const filterLocationList = this.locationIdToFilteredLocationIdList.get(this.selectedConsumablesLocationId);
            return this.consumablesList.filter(item => filterLocationList.includes(item.locationId));
        }
    }

    getFullNameLocation(location, fullLocationList) {
        if (location == null) {
            return fullLocationList.join(" / ");
        }
        fullLocationList.push(location.name);

        const parent = this.locationIdToLocationMap.get(location.parentId);
        return this.getFullNameLocation(parent, fullLocationList)
    };
}