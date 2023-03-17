import {Icon} from 'antd';
import {action, computed, observable} from 'mobx';
import React from 'react';
import {ConsignmentStore} from 'store/api/ConsignmentStore';
import {ContractStore} from 'store/api/ContractStore';
import {EquipmentStore} from 'store/api/EquipmentStore';
import {HardwareTypeStore} from 'store/api/HardwareTypeStore';
import {SessionStore} from 'store/SessionStore';
import {userInfoStore} from 'store/UserInfoStore';
import {authority} from 'utils/Authority';
import {consignmentStateEnum} from 'utils/Enums';
import {EquipmentTableButtonsComponent} from '../component/equipment/EquipmentTableButtonsComponent';
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
import {UserStore} from "store/api/UserStore";
import {LocationFilter} from "utils/LocationFilter";

const defaultEquipment = {
    description: '',
    inventoryNumber: '',
    serialNumber: '',
    modelId: '',
    locationId: '',
    stateId: '',
    contractId: null,
    consignmentId: null,
    price: 0,
    comment: ''
};

const defaultChangeState = {
    stateId: null,
    comment: ''
};

const defaultConsignment = {
    courier: '',
    senderId: null,
    sourceLocationId: null,
    destinationLocationId: null,
    recipientId: null
};

function copyDefaultConsignment() {
    const consignment = copyObject(defaultConsignment);
    const user = userInfoStore.user.value;
    consignment.senderId = user.details.id;
    return consignment;
}

export class EquipmentViewStore {

    constructor() {
        this.equipmentStore = new EquipmentStore();
        this.equipmentStore.loadEquipmentList();
        this.modelStore = new ModelStore();
        this.modelStore.loadModelList();
        this.vendorStore = new VendorStore();
        this.vendorStore.loadVendorList();
        this.locationStore = new LocationStore();
        this.locationStore.loadLocationList();
        this.stateStore = new StateStore();
        this.stateStore.loadStateList();
        this.contractStore = new ContractStore();
        this.contractStore.loadContractList();
        this.consignmentStore = new ConsignmentStore();
        this.consignmentStore.loadConsignmentCreatedList();
        this.hardwareTypeStore = new HardwareTypeStore();
        this.hardwareTypeStore.loadHardwareTypeList();
        this.userStore = new UserStore();
        this.userStore.loadUserList();

        this.pageSize = new SessionStore('equipment.pageSize', 50);
        this.page = new SessionStore('equipment.page', 0);
    }

    @computed
    get columns() {
        return [{
            accessor: 'consignment',
            Cell: ({value}) => {
                console.log(value);
                if (!value) return <Icon title="На месте" type='home'/>;
                switch (value.state) {
                    case consignmentStateEnum.SENT:
                        return <Icon title="В пути" type='car'/>;
                    case consignmentStateEnum.CREATED:
                        return <Icon title="В накладной" type='file-text'/>;
                }
            },
            width: 30,
            filterable: false,
            style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }
        }, {
            Header: <span title="Инвентарный номер">Инв.номер</span>,
            accessor: 'inventoryNumber',
            Cell: ({value}) => {
                return <span title={value}>{value}</span>;
            },
            minWidth: 70,
            ...filterToColumn(this.filters.inventoryNumber)
        }, {
            Header: <span title="Серийный номер">S/N</span>,
            accessor: 'serialNumber',
            Cell: ({value}) => {
                return <span title={value}>{value}</span>;
            },
            minWidth: 120,
            ...filterToColumn(this.filters.serialNumber)
        }, {
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
                const model = this.modelList.find(item => item.id === value);
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
                const location = this.locationList.find(item => item.id === value);
                const fullLocation = this.getFullNameLocation(location, []);
                const title = location && fullLocation;
                return <span title={title}>{title}</span>;
            },
            minWidth: 200,
            ...filterToColumn(this.filters.locationId)
        }, {
            Header: <span title="Состояние">Состояние</span>,
            accessor: 'stateId',
            Cell: ({value}) => {
                const stateName = this.stateIdToStateNameMap.get(value);
                return <span title={stateName}>{stateName}</span>;
            },
            ...filterToColumn(this.filters.stateId)
        }, {
            Header: <span title="Материально ответственный">Ответственный</span>,
            accessor: 'accountablePerson',
            Cell: ({value}) => {
                const title = value && value.name;
                return <span title={title}>{title}</span>;
            },
            ...filterToColumn(this.filters.accountablePerson)
        }, {
            id: 'action',
            Header: <span title="Доступные действия">Действия</span>,
            Cell: props => <EquipmentTableButtonsComponent {...props}/>,
            width: 110,
            filterable: false,
            sortable: false,
            resizable: false
        }];
    }

    @computed
    get filters() {
        // Кэшируем данные для фильтров (хак для MobX)
        const modelIdToModelMap = this.modelIdToModelMap;
        const modelIdToVendorMap = this.modelIdToVendorMap;
        const modelIdToHardwareTypeMap = this.modelIdToHardwareTypeMap;
        return {
            inventoryNumber: new TextFilter('equipment.filters.inventoryNumber'),
            serialNumber: new TextFilter('equipment.filters.serialNumber'),
            modelId: new TextFilter('equipment.filters.modelId', modelId => {
                const model = modelIdToModelMap.get(modelId);
                return model && model.name;
            }),
            description: new TextFilter('equipment.filters.description'),
            stateId: new IdFilter('equipment.filters.stateId', () => this.stateList),
            vendorId: new IdFilter('equipment.filters.vendorId', () => this.vendorList,
                modelId => {
                    const vendor = modelIdToVendorMap.get(modelId);
                    return vendor && vendor.id;
                }),
            hardwareTypeId: new IdFilter('equipment.filters.hardwareType', () => this.hardwareTypeList,
                modelId => {
                    const hardwareType = modelIdToHardwareTypeMap.get(modelId);
                    return hardwareType && hardwareType.id;
                }),
            locationId: new LocationFilter('equipment.filters.location', this.locationListToTree,
                (locationId) => {
                    if (locationId) {
                        this.handleSelectedEquipmentLocationId(locationId);
                        return
                    }
                    this.handleSelectedEquipmentLocationId('root');
                }),
            accountablePerson: new TextFilter('equipment.filters.accountablePerson', user => user && user.name)
        };
    };

    @computed
    get filtered() {
        return filtersToFiltered(this.filters);
    }

    @computed
    get counts() {
        return {
            allRecords: this.equipmentList.length,
            currentRecords: this.filteredEquipmentList.length,
            selectedRecords: this.selectedEquipmentMap.size
        };
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
    get stateLoad() {
        return new WatchList(
            this.equipmentStore.equipmentList,
            this.modelStore.modelList,
            this.vendorStore.vendorList,
            this.locationStore.locationList,
            this.stateStore.stateList,
            this.contractStore.contractList,
            this.hardwareTypeStore.hardwareTypeList,
            this.consignmentStore.consignmentCreatedList
        );
    }

    @computed
    get equipmentList() {
        const equipmentList = this.equipmentStore.equipmentList;
        return equipmentList.value;
    }

    @computed
    get filteredEquipmentList() {
        let list;
        if (this.selectedEquipmentLocationId === 'root') {
            list = this.equipmentList;
        } else {
            const filterLocationList = this.locationIdToFilteredLocationIdListMap.get(this.selectedEquipmentLocationId);
            list = this.equipmentList.filter(item => filterLocationList.includes(item.locationId));
        }
        this.columns.forEach(column => {
            if (column.filterMethod) {
                const id = column.accessor || column.id;
                list = list.filter(row => column.filterMethod({id}, row));
            }
        });
        return list;
    }

    @computed
    get modelList() {
        const modelList = this.modelStore.modelList;
        return modelList.value.filter(item => !item.consumable);
    }

    @computed
    get consumablesModelList() {
        const modelList = this.modelStore.modelList;
        return modelList.value.filter(item => item.consumable);
    }

    @computed
    get modelIdToModelMap() {
        return listToMap(this.modelList);
    }

    @computed
    get consumablesModelIdToModelMap() {
        return listToMap(this.consumablesModelList);
    }

    @computed
    get modelIdToVendorMap() {
        const modelToVendor = model => this.vendorIdToVendorMap.get(model.vendorId);
        return listToMap(this.modelList, modelToVendor);
    }

    @computed
    get consumablesModelIdToVendorMap() {
        const modelToVendor = model => this.vendorIdToVendorMap.get(model.vendorId);
        return listToMap(this.consumablesModelList, modelToVendor);
    }

    @computed
    get modelIdToHardwareTypeMap() {
        const modelToHardwareType = model => this.hardwareIdToHardware.get(model.hardwareTypeId);
        return listToMap(this.modelList, modelToHardwareType);
    }

    @computed
    get consumablesModelIdToHardwareTypeMap() {
        const modelToHardwareType = model => this.hardwareIdToHardware.get(model.hardwareTypeId);
        return listToMap(this.consumablesModelList, modelToHardwareType);
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
    get hardwareTypeList() {
        const hardwareTypeList = this.hardwareTypeStore.hardwareTypeList;
        return hardwareTypeList.value;
    }

    @computed
    get hardwareIdToHardware() {
        return listToMap(this.hardwareTypeList);
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
    get userList() {
        const userList = this.userStore.userList;
        return userList.value;
    }

    //Получить список для отрисовки дерева.
    @computed
    get locationListToTree() {
        return locationListToTree(this.locationList);
    }

    @computed
    get locationIdToFilteredLocationIdListMap() {
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
    get stateList() {
        const stateList = this.stateStore.stateList;
        return stateList.value;
    }

    @computed
    get stateIdToStateNameMap() {
        return listToMap(this.stateList, s => s.name);
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
    equipment = copyObject(defaultEquipment);

    @action
    setEquipmentDescription(description) {
        this.equipment.description = description;
    }

    @action
    setEquipmentInventoryNumber(inventoryNumber) {
        this.equipment.inventoryNumber = inventoryNumber;
    }

    @action
    setEquipmentSerialNumber(serialNumber) {
        this.equipment.serialNumber = serialNumber;
    }

    @action
    setEquipmentModelId(modelId) {
        this.equipment.modelId = modelId;
    }

    @action
    setEquipmentLocationId(locationId) {
        this.equipment.locationId = locationId;
    }

    @action
    setEquipmentStateId(stateId) {
        this.equipment.stateId = stateId;
    }

    @action
    setEquipmentContractId(contractId) {
        this.equipment.contractId = contractId;
    }

    @action
    setEquipmentPrice(price) {
        this.equipment.price = price;
    }


    //Провеверяем права на местоположение.
    hasAuthorityLocationId(locationId) {
        const location = this.locationIdToLocationMap.get(locationId);
        if (!location) return false;
        return userInfoStore.locationIdList.has(location.id) || this.hasAuthorityLocationId(location.parentId);
    }

    getFullNameLocation(location, fullLocationList) {
        if (location == null) {
            return fullLocationList.join(" / ");
        }
        fullLocationList.push(location.name);

        const parent = this.locationIdToLocationMap.get(location.parentId);
        return this.getFullNameLocation(parent, fullLocationList)
    };

    @computed
    get hasAuthorityAddEquipment() {
        return this.selectedEquipmentMap.size === 0 && (authority.SUPER_ADMIN || authority.EQUIPMENT_CREATE);
    };

    @computed
    get hasAuthorityChangeStateEquipment() {
        return this.selectedEquipmentMap.size > 0 && (authority.SUPER_ADMIN || authority.EQUIPMENT_CHANGE_STATE);
    };

    @computed
    get hasAuthorityEditConsignmentEquipment() {
        return (
            this.selectedEquipmentMap.size > 0 &&
            this.consignmentCreatedList.length > 0 &&
            (authority.SUPER_ADMIN || authority.HARDWARE_MOVE || authority.ANOTHERS_HARDWARE_MOVE))
    };

    @computed
    get hasAuthorityCreateConsignment() {
        return authority.SUPER_ADMIN || authority.HARDWARE_MOVE || authority.ANOTHERS_HARDWARE_MOVE;
    };

    hasAuthorityEditEquipment = ({locationId}) => {
        return authority.SUPER_ADMIN || authority.EQUIPMENT_UPDATE && this.hasAuthorityLocationId(locationId);
    };

    hasAuthorityDeleteEquipment = ({locationId}) => {
        return authority.SUPER_ADMIN || authority.EQUIPMENT_DELETE && this.hasAuthorityLocationId(locationId);
    };

    hasAuthorityCheckedEquipment = equipment => {
        if (equipment.consignment != null) {
            return false;
        }

        const ownEquipment = userInfoStore.isAuthorized.id === equipment.accountablePerson.id;
        const ownLocation = this.hasAuthorityLocationId(equipment.locationId);

        return authority.SUPER_ADMIN ||
            authority.HARDWARE_MOVE && ownEquipment && ownLocation ||
            authority.ANOTHERS_HARDWARE_MOVE || // TODO: проверять местоположение
            authority.EQUIPMENT_CHANGE_STATE && ownLocation;
    };

    hasEquipmentInConsignment = ({consignment}) => {
        return consignment;
    };

    hasEquipmentInConsignmentSent = ({consignment}) => {
        return consignment && consignment.state === consignmentStateEnum.SENT;
    };

    hasEquipmentInConsignmentCreated = ({consignment}) => {
        return consignment && consignment.state === consignmentStateEnum.CREATED;
    };

    @action
    handleSaveEquipment() {
        const equipment = copyObject(this.equipment);
        if (equipment.id) {
            this.equipmentStore.editEquipment(equipment);
        } else {
            this.equipmentStore.addEquipment(equipment);
        }
        this.modal = null;
    }

    @action
    handleChangeStateEquipment = () => {
        const changeState = copyObject(this.changeState);
        this.equipmentStore.changeStateEquipment(this.selectedEquipmentMap.keys(), changeState.stateId, changeState.comment);
        this.selectedEquipmentMap.clear();
        this.modal = null;
    };

    @action
    handleEditEquipmentConsignmentId = () => {
        this.equipmentStore.consignmentIdEquipmentAdd(this.selectedEquipmentMap.keys(), this.consignmentId);
        this.consignmentId = null;
        this.selectedEquipmentMap.clear();
        this.modal = null;
    };

    @action
    handleDeleteEquipment(id) {
        this.equipmentStore.deleteEquipment(id);
    }

    @action
    handleRemoveEquipmentConsignment(equipmentId) {
        this.equipmentStore.consignmentIdEquipmentAdd([equipmentId], null);
    }

    @action
    handleCreateConsignment() {
        this.consignmentStore.createConsignment(this.consignment);
        this.consignment = copyDefaultConsignment();
        this.modal = null;
    }

    @observable
    modal = null;

    @action
    hideModal() {
        this.modal = null;
    }

    @action
    showModalEquipmentAdd() {
        this.equipment = copyObject(this.equipment);
        delete this.equipment.id;
        this.equipment.inventoryNumber = '';
        this.equipment.serialNumber = '';
        this.equipment.description = '';
        this.equipment.contractId = null;
        this.equipment.price = 0;
        this.modal = 'EDIT_EQUIPMENT';
        this.card = null;
    }

    @action
    showModalEquipmentEdit(equipment) {
        this.equipment = copyObject(equipment);
        this.card = null;
        this.modal = 'EDIT_EQUIPMENT';
    }

    @action
    showModalEquipmentEditConsignment() {
        this.modal = 'EDIT_CONSIGNMENT';
        this.card = null;
    }

    @action
    showModalEquipmentChangeState() {
        this.modal = 'CHANGE_STATE_EQUIPMENT';
        this.defaultChangeState();
    }

    @action
    showModalConsignmentCreate() {
        this.consignment = copyDefaultConsignment();
        this.modal = 'CREATE_CONSIGNMENT';
        this.card = null;
    }


    @computed
    get consignmentEquipmentList() {
        const equipmentList = this.consignmentStore.equipmentList;
        return equipmentList.value;
    }

    //Отображение оборудования из накладной в истории
    columnsEquipments = [
        {
            id: 'vendorId',
            Header: "Производитель",
            accessor: 'modelId',
            Cell: ({value}) => {
                const vendor = this.modelIdToVendorMap.get(value);
                const title = vendor && vendor.name;
                return <span title={title}>{title}</span>
            }
        }, {
            id: 'modelId',
            Header: "Модель",
            accessor: 'modelId',
            Cell: ({value}) => {
                const model = this.modelIdToModelMap.get(value);
                const title = model && model.name;
                return <span title={title}>{title}</span>
            }
        }, {
            id: 'hardwareTypeId',
            Header: "Тип",
            accessor: 'modelId',
            Cell: ({value}) => {
                const hardwareType = this.modelIdToHardwareTypeMap.get(value);
                const title = hardwareType && hardwareType.name;
                return <span title={title}>{title}</span>;
            }
        }
    ];

    @computed
    get columnsEquipment() {
        const columnsEquipment = copyObject(this.columnsEquipments);
        columnsEquipment.unshift({
            Header: 'Инв. номер',
            accessor: 'inventoryNumber',
            Cell: ({value}) => {
                return <span title={value}>{value}</span>;
            }
        }, {
            Header: 'S/N',
            accessor: 'serialNumber',
            Cell: ({value}) => {
                return <span title={value}>{value}</span>;
            }
        });
        return columnsEquipment
    }

    @computed
    get stateIdToStateMap() {
        const map = new Map();
        this.stateList.forEach(item => map.set(item.id, item));
        return map;
    }

    @computed
    get columnsEquipmentWithState() {
        const columnsEquipmentWithState = copyObject(this.columnsEquipment);
        columnsEquipmentWithState.push({
            Header: 'Состояние',
            accessor: 'stateId',
            Cell: ({value}) => {
                const state = this.stateIdToStateMap.get(value);
                const title = state && state.name;
                return <span title={title}>{title}</span>
            }
        });
        return columnsEquipmentWithState
    }

    @computed
    get columnsEquipmentActionView() {
        return copyObject(this.columnsEquipmentWithState);
    }
    //

    //Отображение расходников из накладной в истории
    columnsConsumables = [
        {
            id: 'vendorId',
            Header: "Производитель",
            accessor: 'modelId',
            Cell: ({value}) => {
                const vendor = this.consumablesModelIdToVendorMap.get(value);
                const title = vendor && vendor.name;
                return <span title={title}>{title}</span>
            }
        }, {
            id: 'modelId',
            Header: "Модель",
            accessor: 'modelId',
            Cell: ({value}) => {
                const model = this.consumablesModelIdToModelMap.get(value);
                const title = model && model.name;
                return <span title={title}>{title}</span>
            }
        }, {
            id: 'hardwareTypeId',
            Header: "Тип",
            accessor: 'modelId',
            Cell: ({value}) => {
                const hardwareType = this.consumablesModelIdToHardwareTypeMap.get(value);
                const title = hardwareType && hardwareType.name;
                return <span title={title}>{title}</span>;
            }
        }, {
            Header: 'Кол-во',
            accessor: 'count',
            Cell: ({value}) => {
                return <span title={value}>{value}</span>;
            }
        }
    ];

    @computed
    get columnsConsumablesWithState() {
        const columnsConsumablesWithState = copyObject(this.columnsConsumables);
        columnsConsumablesWithState.push({
            Header: 'Состояние',
            accessor: 'stateId',
            Cell: ({value}) => {
                const state = this.stateIdToStateMap.get(value);
                const title = state && state.name;
                return <span title={title}>{title}</span>
            }
        });
        return columnsConsumablesWithState
    }

    @computed
    get columnsConsumablesActionView() {
        return copyObject(this.columnsConsumablesWithState);
    }

    @action
    showModalViewConsignment(consignment, comment) {
        this.comment = comment;
        this.consignment = copyObject(consignment);
        this.consignmentStore.loadEquipmentList(consignment.id);
        this.consignmentStore.loadConsumablesList(consignment.id);
        this.modal = 'VIEW_CONSIGNMENT';
    }

    //Флаги для отображения расходников и оборудования из накладной в истории
    @computed
    get stateEquipmentAndConsumablesLoad() {
        return new WatchList(
            this.consignmentStore.equipmentList,
            this.consignmentStore.consumablesList
        )
    }

    @computed
    get consumablesList() {
        const equipmentList = this.consignmentStore.consumablesList;
        return equipmentList.value;
    }

    @computed
    get showConsumablesList() {
        return this.consumablesList.length > 0
    }

    @computed
    get showEquipmentList() {
        return this.consignmentEquipmentList.length > 0
    }
    //

    @action
    showModalOperationComment() {
        this.modal = 'OPERATION_COMMENT';
    }

    @observable
    card = null;

    @action
    hideCard() {
        this.card = null;
    }

    @action
    showCardEquipmentDescription(equipment) {
        this.equipment = copyObject(equipment);
        this.card = 'CARD_EQUIPMENT_DESCRIPTION';
    }

    @action
    showCardEquipmentHistory({id}) {
        this.equipmentStore.loadEquipmentHistory(id);
        this.card = 'CARD_EQUIPMENT_HISTORY';
    }

    @computed
    get stateLoadHistory() {
        return new WatchList(
            this.equipmentStore.equipmentHistory
        );
    }

    @computed
    get equipmentHistory() {
        const equipmentHistory = this.equipmentStore.equipmentHistory;
        return equipmentHistory.value;
    }

    @computed
    get locationIdToLocationName() {
        return listToMap(this.locationList, l => l.name);
    }

    @computed
    get consignmentOperation() {

    }

    @computed
    get idMapper() {
        return new Map([...this.stateIdToStateNameMap, ...this.locationIdToLocationName]);
    }


    @observable
    selectedEquipmentLocationId = 'root';

    @action
    handleSelectedEquipmentLocationId(locationId) {
        if (locationId) {
            this.selectedEquipmentLocationId = locationId;
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


    selectedEquipmentMap = observable.map({});

    @computed
    get selectedAllEquipment() {
        return this.filteredEquipmentList.every(row => {
            return this.selectedEquipmentMap.has(row.id);
        });
    }

    @action
    handleSelectedEquipment = equipmentId => {
        if (this.selectedEquipmentMap.has(equipmentId)) {
            this.selectedEquipmentMap.delete(equipmentId);
        } else {
            this.selectedEquipmentMap.set(equipmentId, true);
        }
    };

    @action
    handleSelectedAllEquipment = () => {
        if (this.selectedAllEquipment) {
            this.filteredEquipmentList.forEach(e => {
                this.selectedEquipmentMap.delete(e.id);
            });
        } else {
            this.filteredEquipmentList.forEach(e => {
                this.selectedEquipmentMap.set(e.id, true);
            });
        }
    };

    isSelectedEquipment = (id) => {
        return this.selectedEquipmentMap.has(id);
    };


    @observable
    consignmentId = null;

    @action
    setConsignmentId(consignmentId) {
        this.consignmentId = consignmentId;
    }


    //Добавления фильтра для истории операций

    operationFilter = new SessionStore('equipment.filters.historyOperation', []);

    @computed
    get filterOperationSelectSet() {
        return new Set(this.operationFilter.value);
    }

    filterOperation = (operation) => {
        return this.operationFilter.value.find(item => item === operation.type);
    };

    @action
    setFilterOperation = (checked, valueFilterOperation) => {
        const filterOperation = [];
        if (checked) {
            this.filterOperationSelectSet.add(valueFilterOperation);
        } else {
            this.filterOperationSelectSet.delete(valueFilterOperation);
        }
        this.filterOperationSelectSet.forEach(item => filterOperation.push(item));
        this.operationFilter.setValue(filterOperation);
    };


    @observable
    changeState = copyObject(defaultChangeState);

    @action
    defaultChangeState() {
        this.changeState = copyObject(defaultChangeState);
    }

    @action
    setChangeStateId(stateId) {
        this.changeState.stateId = stateId
    }

    @action
    setChangeStateComment(comment) {
        this.changeState.comment = comment
    }


    @observable
    consignment = copyObject(defaultConsignment);

    @action
    setConsignmentSenderId(userId) {
        this.consignment.senderId = userId;
    }

    @action
    setConsignmentCourier(courier) {
        this.consignment.courier = courier;
    }

    @action
    setConsignmentSourceLocationId(locationId) {
        this.consignment.sourceLocationId = locationId;
    }

    @action
    setConsignmentDestinationLocationId(locationId) {
        this.consignment.destinationLocationId = locationId;
    }

    @action
    setConsignmentRecipientId(userId) {
        this.consignment.recipientId = userId;
    }

}
