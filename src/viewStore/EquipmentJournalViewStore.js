import {Icon} from 'antd';
import {EquipmentJournalButtonComponent} from 'component/equipment/buttons/EquipmentJournalButtonComponent';
import {action, computed, observable} from 'mobx';
import moment from 'moment'
import React from 'react';
import {ConsignmentStore} from 'store/api/ConsignmentStore';
import {ConsumablesStore} from 'store/api/ConsumablesStore';
import {ContractStore} from 'store/api/ContractStore';
import {EquipmentStore} from 'store/api/EquipmentStore';
import {HardwareTypeStore} from 'store/api/HardwareTypeStore';
import {LocationStore} from 'store/api/LocationStore';
import {ModelStore} from 'store/api/ModelStore';
import {StateStore} from 'store/api/StateStore';
import {VendorStore} from 'store/api/VendorStore';
import {listToMap} from 'utils/Collections';
import {consignmentStateEnum, consumablesOperationTypeEnum, equipmentOperationTypeEnum} from 'utils/Enums';
import {IdFilter} from 'utils/IdFilter';
import {filtersToFiltered, filterToColumn} from 'utils/ReactTableUtils';
import {TextFilter} from 'utils/TextFilter';
import {copyObject} from '../utils/copyObject';
import {WatchList} from '../utils/WatchList';

const startDate = moment().subtract(7, 'days');
const endDate = moment().add(1, 'days');

const defaultConsignment = {
    courier: '',
    senderId: null,
    sourceLocationId: null,
    destinationLocationId: null,
    recipientId: null,
    comment: null
};

const editsValueEquipment = (oldValue, newValue, isNew = true) => {
    if (oldValue) {
        const equipment = {};
        const equipmentValues = Object.keys(oldValue);
        equipmentValues.forEach(item => {
            if (oldValue[item] === newValue[item]) {
                return
            }
            equipment[item] = isNew ? newValue[item] : oldValue[item]
        });
        return equipment
    }
};

export class EquipmentJournalViewStore {

    @observable
    period = [startDate, endDate];

    @action
    setPeriod = (period) => {
        this.period = period
    };

    constructor() {
        this.equipmentStore = new EquipmentStore();
        this.equipmentStore.loadEquipmentList();
        this.equipmentStore.loadEquipmentJournal(startDate, endDate);
        this.consumablesStore = new ConsumablesStore();
        this.consumablesStore.loadConsumablesList();
        this.modelStore = new ModelStore();
        this.modelStore.loadModelList();
        this.vendorStore = new VendorStore();
        this.vendorStore.loadVendorList();
        this.hardwareTypeStore = new HardwareTypeStore();
        this.hardwareTypeStore.loadHardwareTypeList();
        this.locationStore = new LocationStore();
        this.locationStore.loadLocationList();
        this.stateStore = new StateStore();
        this.stateStore.loadStateList();
        this.contractStore = new ContractStore();
        this.contractStore.loadContractList();
        this.consignmentStore = new ConsignmentStore();
    }

    @computed
    get filters() {
        // Кэшируем данные для фильтров (хак для MobX)
        const modelIdToModelMap = this.modelIdToModelMap;
        const modelIdToVendorMap = this.modelIdToVendorMap;
        const modelIdToHardwareTypeMap = this.modelIdToHardwareTypeMap;
        return {
            type: new TextFilter('journal.filters.type'),
            equipmentType: new TextFilter('journal.filters.equipmentType'),
            timestamp: new TextFilter('journal.filters.timestamp', timestamp => timestamp),
            userName: new TextFilter('journal.filters.userName', userName => userName),
            inventoryNumber: new TextFilter('journal.filters.inventoryNumber', equipment => equipment.inventoryNumber),
            serialNumber: new TextFilter('journal.filters.serialNumber', equipment => equipment.serialNumber),
            vendor: new IdFilter('journal.filters.vendor', () => this.vendorList, vendor => vendor.id),
            model: new TextFilter('journal.filters.model', model => model.name),
            hardwareType: new IdFilter('journal.filters.equipmentId', () => this.hardwareTypeList, hardwareType => hardwareType.id),
            count: new TextFilter('journal.filters.count', count => count),
            newValue: new TextFilter('journal.filters.meta', meta => {
                return meta.map(v => v.value).join('\n');
            }),
            comment: new TextFilter('journal.filters.comment', comment => comment),
            consignmentId: new TextFilter('journal.filters.consignmentId'),
        };
    }

    @observable
    consignment = copyObject(defaultConsignment);

    @observable
    modal = null;

    @action
    hideModal() {
        this.modal = null;
    }

    @computed
    get filtered() {
        return filtersToFiltered(this.filters);
    }

    @computed
    get columns() {
        return [
            {
                Header: 'Дополнительная информация',
                columns: [
                    {
                        accessor: 'type',
                        width: 25,
                        Cell: this.cellOperationType,
                        ...filterToColumn(this.filters.type)
                    },
                    {
                        id: 'equipmentType',
                        accessor: 'equipmentId',
                        width: 25,
                        Cell: this.cellEquipmentType,
                        ...filterToColumn(this.filters.equipmentType)
                    },
                    {
                        Header: 'Дата',
                        accessor: 'timestamp',
                        width: 120,
                        Cell: this.cellOperationDate,
                        ...filterToColumn(this.filters.timestamp)
                    },
                    {
                        id:'userName',
                        Header: 'Пользователь',
                        accessor: 'userName',
                        width: 120,
                        Cell: ({value}) => {
                            return <span title={value}>{value}</span>;
                        },
                        ...filterToColumn(this.filters.userName)
                    },
                    {
                        id: 'inventoryNumber',
                        Header: 'Инв.номер',
                        accessor: 'equipment',
                        width: 110,
                        Cell: this.cellField('inventoryNumber'),
                        ...filterToColumn(this.filters.inventoryNumber)
                    },
                    {
                        id: 'serialNumber',
                        Header: 'S/N',
                        accessor: 'equipment',
                        width: 190,
                        Cell: this.cellField('serialNumber'),
                        ...filterToColumn(this.filters.serialNumber)
                    },
                    {
                        id: 'vendor',
                        Header: 'Производитель',
                        accessor: 'vendor',
                        width: 160,
                        Cell: this.cellField('name'),
                        ...filterToColumn(this.filters.vendor)
                    },
                    {
                        id: 'model',
                        Header: 'Модель',
                        accessor: 'model',
                        width: 160,
                        Cell: this.cellField('name'),
                        ...filterToColumn(this.filters.model)
                    },
                    {
                        id: 'hardwareType',
                        Header: 'Тип оборуд-ния',
                        accessor: 'hardwareType',
                        width: 130,
                        Cell: this.cellField('name'),
                        ...filterToColumn(this.filters.hardwareType)
                    },
                    {
                        Header: 'Кол-во',
                        accessor: 'count',
                        width: 60,
                        Cell: ({value}) => {
                            return <span title={value}>{value}</span>;
                        },
                        ...filterToColumn(this.filters.count)
                    }
                ]
            }, {
                Header: 'Изменения',
                columns: [
                    {
                        Header: 'Новое значение',
                        accessor: 'newValue',
                        Cell: this.cellOperationMetaNew,
                        ...filterToColumn(this.filters.newValue)
                    },
                    {
                        Header: 'Комментарий',
                        accessor: 'comment',
                        Cell: this.commentOperationMetaNew,
                        ...filterToColumn(this.filters.comment)
                    },
                    {
                        accessor: 'consignmentId',
                        width: 35,
                        Cell: this.consignmentCell,
                        ...filterToColumn(this.filters.consignmentId)
                    }

                ]
            }];
    }

    consignmentCell = ({original}) => {
        const consignmentId = original.consignmentId;
        const comment = original.comment;
        if (consignmentId != null) {
            const consignment = this.loadConsignment(consignmentId);
            return <EquipmentJournalButtonComponent consignment={consignment} comment={comment}/>
        }
    };

    @action
    loadConsignment(consignmentId) {
        this.consignmentStore.loadConsignment(consignmentId);
        return this.consignmentStore.consignment;
    }

    @action
    showModalViewConsignment(consignment, comment) {
        this.consignment = copyObject(consignment.value);
        this.consignmentStore.loadEquipmentList(consignment.value.id);
        this.consignmentStore.loadConsumablesList(consignment.value.id);
        this.consignment.comment = comment;
        this.modal = 'VIEW_CONSIGNMENT';
    }

    @computed
    get stateEquipmentAndConsumablesLoad() {
        return new WatchList(
            this.consignmentStore.equipmentList,
            this.consignmentStore.consumablesList
        )
    }

    cellOperationType = ({original, value}) => {
        if (value === equipmentOperationTypeEnum.EQUIPMENT_ADD || value === consumablesOperationTypeEnum.CONSUMABLES_ADD) {
            return <Icon type="plus-circle-o" title="Добавлено"/>
        }

        if (value === equipmentOperationTypeEnum.EQUIPMENT_CHANGE_STATE) {
            return <Icon type="tool" title="Изменено состояние"/>
        }

        if (value === equipmentOperationTypeEnum.EQUIPMENT_EDIT ||
            original.type === consumablesOperationTypeEnum.CONSUMABLES_EDIT) {
            return <Icon type="edit" title="Отредактировано"/>
        }

        if (value === equipmentOperationTypeEnum.EQUIPMENT_SEND) {
            const equpmentState = original.equipmentState;
            if (equpmentState === consignmentStateEnum.RECEIVED) {
                return <Icon style={{color: 'green'}} type="car" title="Отправлено"/>
            } else if (equpmentState === consignmentStateEnum.NOT_RECEIVED) {
                return <Icon style={{color: 'red'}} type="car" title="Отправлено"/>
            }
            return <Icon type="car" title="Отправлено"/>
        }

        if (value === equipmentOperationTypeEnum.EQUIPMENT_ACCEPTED) {
            if (original.equipmentState === consignmentStateEnum.RECEIVED) {
                return <Icon style={{color: 'green'}} type="check-circle-o" title="Принято"/>
            } else if (original.equipmentState === consignmentStateEnum.NOT_RECEIVED) {
                return <Icon style={{color: 'red'}} type="close-circle-o" title="Не принято"/>
            }
            return <Icon type="minus-circle-o" title="Частично принято"/>
        }

        if (value === equipmentOperationTypeEnum.EQUIPMENT_DELETE ||
            value === consumablesOperationTypeEnum.CONSUMABLES_DELETE) {
            return <Icon type="delete" title="Удалено"/>
        }
        return <span>Действие неизвестно</span>
    };

    cellEquipmentType = ({value}) => {
        const equipment = this.equipmentIdToEquipmentMap.get(value);
        if (equipment) {
            if (equipment.serialNumber || equipment.inventoryNumber) {
                return <Icon type="hdd"/>
            }
            return <Icon type="retweet"/>
        }
        return '-'
    };

    cellOperationDate = ({value}) => {
        const operationTime = moment(value).format('HH:mm DD.MM.YYYY');
        return <span title={operationTime}>{operationTime}</span>;
    };

    cellField = field => ({value}) => {
        if (value) {
            return <span title={value[field]}>{value[field]}</span>;
        } else {
            return <span>Данных нет</span>;
        }
    };

    cellOperationMetaNew = ({value}) => {
        const content = value.map((item, index) => {
            if (item.name == null) {
                return <div key={index}>{item.value}</div>
            } else {
                return <div key={index}>{item.name}: {item.value}</div>
            }
        });
        return  <div>
                    {content}
                </div>
    };

    commentOperationMetaNew = ({value}) => {
        const content = value.split('\n').map((item) => {
            return <div>{item}</div>
        });
        return  <div title={value} style={{whiteSpace:'normal'}}>
                    {content}
                </div>
    };

    metaNew = (original) => {
        const operationMeta = original.meta;
        if (original.type === equipmentOperationTypeEnum.EQUIPMENT_ADD ||
            original.type === consumablesOperationTypeEnum.CONSUMABLES_ADD) {
            return this.createEquipmentMeta(operationMeta.new);
        }
        if (original.type === equipmentOperationTypeEnum.EQUIPMENT_CHANGE_STATE ||
            original.type === equipmentOperationTypeEnum.EQUIPMENT_EDIT ||
            original.type === consumablesOperationTypeEnum.CONSUMABLES_EDIT) {
            const equipment = editsValueEquipment(operationMeta.old, operationMeta.new);
            return this.createEquipmentMeta(equipment);
        }
        if (original.type === equipmentOperationTypeEnum.EQUIPMENT_SEND ||
            original.type === equipmentOperationTypeEnum.EQUIPMENT_ACCEPTED) {
            const locationId = original.meta.new.destinationLocationId;
            return this.createLocationMove(locationId)
        }
        return [];
    };

    @computed
    get stateIdToStateMap() {
        const map = new Map();
        this.stateList.forEach(item => map.set(item.id, item));
        return map;
    }

    //расходники
    columnsConsumables = [
        {
            id: 'vendorId',
            Header: 'Производитель',
            accessor: 'modelId',
            Cell: ({value}) => {
                const vendor = this.consumablesModelIdToVendorMap.get(value);
                const title = vendor && vendor.name;
                return <span title={title}>{title}</span>
            }
        }, {
            id: 'modelId',
            Header: 'Модель',
            accessor: 'modelId',
            Cell: ({value}) => {
                const model = this.consumablesModelIdToModelMap.get(value);
                const title = model && model.name;
                return <span title={title}>{title}</span>
            }
        }, {
            id: 'hardwareTypeId',
            Header: 'Тип',
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
    get showConsumablesList() {
        return this.consignmentConsumablesList.length > 0
    }

    @computed
    get consumablesModelIdToHardwareTypeMap() {
        const modelToHardwareType = model => this.hardwareIdToHardware.get(model.hardwareTypeId);
        return listToMap(this.consumablesModelList, modelToHardwareType);
    }

    @computed
    get consumablesModelIdToVendorMap() {
        const modelToVendor = model => this.vendorIdToVendorMap.get(model.vendorId);
        return listToMap(this.consumablesModelList, modelToVendor);
    }

    @computed
    get consumablesModelIdToModelMap() {
        return listToMap(this.consumablesModelList);
    }

    @computed
    get consumablesModelList() {
        const modelList = this.modelStore.modelList;
        return modelList.value.filter(item => item.consumable);
    }

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

    @computed
    get consignmentConsumablesList() {
        const consumablesList = this.consignmentStore.consumablesList;
        return consumablesList.value;
    }

    //оборудование
    columnsEquipments = [
        {
            id: 'vendorId',
            Header: 'Производитель',
            accessor: 'modelId',
            Cell: ({value}) => {
                const vendor = this.modelIdToVendorMap.get(value);
                const title = vendor && vendor.name;
                return <span title={title}>{title}</span>
            }
        }, {
            id: 'modelId',
            Header: 'Модель',
            accessor: 'modelId',
            Cell: ({value}) => {
                const model = this.modelIdToModelMap.get(value);
                const title = model && model.name;
                return <span title={title}>{title}</span>
            }
        }, {
            id: 'hardwareTypeId',
            Header: 'Тип',
            accessor: 'modelId',
            Cell: ({value}) => {
                const hardwareType = this.modelIdToHardwareTypeMap.get(value);
                const title = hardwareType && hardwareType.name;
                return <span title={title}>{title}</span>;
            }
        }
    ];

    @computed
    get consignmentEquipmentList() {
        const equipmentList = this.consignmentStore.equipmentList;
        return equipmentList.value;
    }

    @computed
    get showEquipmentList() {
        return this.consignmentEquipmentList.length > 0
    }

    @computed
    get modelIdToHardwareTypeMap() {
        const modelToHardwareType = model => this.hardwareIdToHardware.get(model.hardwareTypeId);
        return listToMap(this.modelList, modelToHardwareType);
    }

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

    @computed
    get stateLoad() {
        return new WatchList(
            this.equipmentStore.equipmentList,
            this.equipmentStore.equipmentJournal,
            this.consumablesStore.consumablesList,
            this.modelStore.modelList,
            this.vendorStore.vendorList,
            this.hardwareTypeStore.hardwareTypeList,
            this.locationStore.locationList,
            this.stateStore.stateList,
            this.contractStore.contractList
        );
    }

    @computed
    get equipmentList() {
        const equipmentList = this.equipmentStore.equipmentList;
        return equipmentList.value;
    }

    @computed
    get consumablesList() {
        const consumablesList = this.consumablesStore.consumablesList;
        return consumablesList.value;
    }

    @computed
    get equipmentIdToEquipmentMap() {
        const equipmentList = this.equipmentList.concat(this.consumablesList);
        return listToMap(equipmentList)
    }

    @computed
    get modelList() {
        const modelList = this.modelStore.modelList;
        return modelList.value;
    }

    @computed
    get modelIdToModelMap() {
        return listToMap(this.modelList);
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
    get equipmentJournalList() {
        const equipmentJournal = this.equipmentStore.equipmentJournal;
        return equipmentJournal.value.map(source => {
            const record = {
                operationId: source.operationId,
                equipmentId: source.equipmentId,
                equipmentState: source.equipmentState,
                timestamp: source.timestamp,
                type: source.type,
                userName: source.user.name,
                consignmentId: source.consignmentId,
                meta: source.meta,
                comment: source.comment,
                newValue: this.metaNew(source)
            };

            record.equipment = _.defaultTo(this.equipmentIdToEquipmentMap.get(record.equipmentId), {
                serialNumber: "удален",
                inventoryNumber: "удален",
            });
            record.model = _.defaultTo(this.modelIdToModelMap.get(record.equipment.modelId), {
                name: "удалена"
            });
            record.vendor = _.defaultTo(this.vendorIdToVendorMap.get(record.model.vendorId), {
                name: "удален"
            });
            record.hardwareType = _.defaultTo(this.hardwareIdToHardware.get(record.model.hardwareTypeId), {
                name: "удален"
            });

            return record;
        });
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
    get contractList() {
        const contractList = this.contractStore.contractList;
        return contractList.value;
    }

    @computed
    get contractIdToContractMap() {
        return listToMap(this.contractList);
    }

    getFullNameLocation(location, fullLocationList) {
        if (location == null) {
            return fullLocationList.join(' / ');
        }
        fullLocationList.push(location.name);

        const parent = this.locationIdToLocationMap.get(location.parentId);
        return this.getFullNameLocation(parent, fullLocationList)
    };

    createEquipmentMeta = (equipment) => {
        if (!equipment) {
            return null
        }

        const result = [];

        if (equipment.inventoryNumber != null) {
            result.push({name: 'Инв. номер', value: equipment.inventoryNumber});
        }
        if (equipment.serialNumber != null) {
            result.push({name: 'S/N', value: equipment.serialNumber})
        }
        if (equipment.modelId != null) {
            const model = this.modelIdToModelMap.get(equipment.modelId);
            result.push({name: 'Модель', value: _.get(model, 'name', 'удалена')});
        }
        if (equipment.contractId != null) {
            const contract = this.contractIdToContractMap.get(equipment.contractId);
            result.push({name: 'Контракт', value: _.get(contract, 'number', 'удален')});
        }
        if (equipment.count != null) {
            result.push({name: 'Кол-во', value: equipment.count});
        }
        if (equipment.locationId != null) {
            const location = this.locationIdToLocationMap.get(equipment.locationId);
            result.push({name: 'Локация', value: _.get(location, 'name', 'удалено')});
        }
        if (equipment.stateId != null) {
            const state = this.stateIdToStateMap.get(equipment.stateId);
            result.push({name: 'Состояние', value: _.get(state, 'name', 'удалено')});
        }
        if (equipment.description != null) {
            result.push({name: 'Описание', value: equipment.description});
        }
        if (equipment.price != null) {
            result.push({name: 'Цена', value: equipment.price});
        }

        return result;
    };

    createLocationMove = (locationId) => {
        const location = this.locationIdToLocationMap.get(locationId);
        if (location) {
            const fullLocation = this.getFullNameLocation(location, []);
            const title = location && fullLocation;
            return [{value: title}];
        }
        return [];
    };

    handleSetPeriodView = () => {
        this.equipmentStore.loadEquipmentJournal(this.period[0], this.period[1])
    };
}