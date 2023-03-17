import {Breadcrumb, Icon} from 'antd';
import {ButtonsTableConsignmentAcceptComponent} from 'component/consignment/tables/buttons/ButtonsTableConsignmentAcceptComponent';
import {ButtonsTableConsignmentCreatedComponent} from 'component/consignment/tables/buttons/ButtonsTableConsignmentCreatedComponent';
import {ButtonsTableConsignmentSentComponent} from 'component/consignment/tables/buttons/ButtonsTableConsignmentSentComponent';
import {ButtonsTableConsumablesAcceptedComponent} from 'component/consignment/tables/buttons/ButtonsTableConsumablesAcceptedComponent';
import {ButtonsTableConsumablesSendComponent} from 'component/consignment/tables/buttons/ButtonsTableConsumablesSendComponent';
import {ButtonsTableEquipmentAcceptConsignmentComponent} from 'component/consignment/tables/buttons/ButtonsTableEquipmentAcceptComponent';
import {ButtonsTableEquipmentSendComponent} from 'component/consignment/tables/buttons/ButtonsTableEquipmentSendComponent';
import {action, computed, observable} from 'mobx';
import React from 'react';
import {ConsumablesStore} from 'store/api/ConsumablesStore';
import {EquipmentStore} from 'store/api/EquipmentStore';
import {LocationStore} from 'store/api/LocationStore';
import {ModelStore} from 'store/api/ModelStore';
import {StateStore} from 'store/api/StateStore';
import {UserStore} from 'store/api/UserStore';
import {VendorStore} from 'store/api/VendorStore';
import {SessionStore} from 'store/SessionStore';
import {userInfoStore} from 'store/UserInfoStore';
import {authority} from 'utils/Authority';
import {consignmentStateEnum} from 'utils/Enums';
import {locationListToTree} from 'utils/locationListToLocationTreeList';
import {modals} from 'utils/ModalName';
import {ConsignmentStore} from '../store/api/ConsignmentStore';
import {copyObject} from '../utils/copyObject';
import {filtersToFiltered} from '../utils/ReactTableUtils';
import {TextFilter} from '../utils/TextFilter';
import {WatchList} from '../utils/WatchList';
import moment from "moment/moment";

//TODO: реализовать фильтры накладных

const defaultConsignment = {
    courier: null,
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

const defaultAcceptedConsignment = {
    id: null,
    acceptedEquipments: []
};

export class ConsignmentViewStore {
    columnsNumberConsignment = [{
        Header: '',
        accessor: 'number',
        filterable: false,
        width: 22,
        Cell: ({original}) => {
            const {sender} = original;
            const imSender = sender.id === userInfoStore.isAuthorized.id;
            const imRecipient = this.hasAuthorityAccept(original);
            if (imSender && imRecipient) {
                return <Icon style={{color: 'black'}} type="retweet"/>;
            } else if (imSender) {
                return <Icon style={{color: 'red'}} type="arrow-left"/>;
            } else if (imRecipient) {
                return <Icon style={{color: 'green'}} type="arrow-right"/>
            } else {
                return <Icon style={{color: 'black'}} type="arrow-left"/>;
            }
        },
    }, {
        Header: <span title="Номер накладной">Номер</span>,
        accessor: 'number',
        filterable: false,
        width: 100,
        Cell: ({value}) => {
            return <span title={value}>{value}</span>
        }
    }];

    columnsConsignment = [{
        Header: <span title="Отправитель">Отправитель</span>,
        accessor: 'sender',
        filterable: false,
        Cell: ({value}) => {
            const title = value && value.name;
            return <span title={title}>{title}</span>
        },
    }, {
        Header: <span title="Откуда">Откуда</span>,
        accessor: 'sourceLocationId',
        Cell: ({value}) => {
            const location = this.locationIdToLocationMap.get(value);
            const parentNameList = this.locationIdToParentNameListMap.get(value);
            const RenderItems = () => {
                return parentNameList.map(item => <Breadcrumb.Item title={item} key={item}>{item}</Breadcrumb.Item>)
            };
            const title = location && location.name;
            return (
                <Breadcrumb style={{
                    fontSize: 12
                }}>
                    {parentNameList && RenderItems()}
                    <Breadcrumb.Item title={title}>{title}</Breadcrumb.Item>
                </Breadcrumb>
            )
        },
        filterable: false
    }, {
        Header: <span title="Куда">Куда</span>,
        accessor: 'destinationLocationId',
        filterable: false,
        Cell: ({value}) => {
            const location = this.locationIdToLocationMap.get(value);
            const parentNameList = this.locationIdToParentNameListMap.get(value);
            const RenderItems = () => {
                return parentNameList.map(item => <Breadcrumb.Item title={item} key={item}>{item}</Breadcrumb.Item>)
            };
            const title = location && location.name;
            return (
                <Breadcrumb style={{
                    fontSize: 12
                }}>
                    {parentNameList && RenderItems()}
                    <Breadcrumb.Item title={title}>{title}</Breadcrumb.Item>
                </Breadcrumb>
            )
        }
    }, {
        Header: <span title="Получатель">Получатель</span>,
        accessor: 'recipient',
        filterable: false,
        Cell: ({value}) => {
            const title = value && value.name;
            return <span title={title}>{title}</span>
        }
    }, {
        Header: <span title="Курьер">Курьер</span>,
        accessor: 'courier',
        filterable: false,
        Cell: ({value}) => {
            return <span title={value}>{value}</span>
        }
    }];

    @computed
    get columnCreatedConsignment() {
        const columnsConsignment = copyObject(this.columnsNumberConsignment);
        columnsConsignment.push({
            Header: <span title="Дата создания">Создание</span>,
            accessor: 'timestamp',
            filterable: false,
            width: 95,
            Cell: ({value}) => {
                const date = moment(value).format('DD.MM.YYYY LTS');
                return <span title={date}>{date}</span>
            }
        });
        const columnsCreatedConsignment = columnsConsignment.concat(this.columnsConsignment);

        columnsCreatedConsignment.push({
            id: 'action',
            Header: <span title="Доступные действия">Действия</span>,
            width: 100,
            Cell: props => <ButtonsTableConsignmentCreatedComponent {...props}/>,
            filterable: false,
            sortable: false,
            resizable: false
        });

        return columnsCreatedConsignment
    }

    @computed
    get columnSentConsignment() {
        const columnsConsignment = copyObject(this.columnsNumberConsignment);

        columnsConsignment.push({
            Header: <span title="Дата создания">Создание</span>,
            accessor: 'timestamp',
            filterable: false,
            width: 95,
            Cell: ({value}) => {
                const date = moment(value).format('DD.MM.YYYY LTS');
                return <span title={date}>{date}</span>
            }
        }, {
            Header: <span title="Дата отправки">Отправка</span>,
            accessor: 'sentTimestamp',
            filterable: false,
            width: 95,
            Cell: ({value}) => {
                const date = moment(value).format('DD.MM.YYYY LTS');
                return <span title={date}>{date}</span>
            }
        });
        const columnsSentConsignment = columnsConsignment.concat(this.columnsConsignment);
        columnsSentConsignment.push({
            id: 'action',
            Header: <span title="Доступные действия">Действия</span>,
            width: 100,
            Cell: props => <ButtonsTableConsignmentSentComponent {...props}/>,
            filterable: false,
            sortable: false,
            resizable: false
        });

        return columnsSentConsignment
    }

    @computed
    get columnAcceptedConsignment() {
        const columnsConsignment = copyObject(this.columnsNumberConsignment);

        columnsConsignment.push({
            Header: <span title="Дата отправки">Отправка</span>,
            accessor: 'sentTimestamp',
            filterable: false,
            width: 95,
            Cell: ({value}) => {
                const date = moment(value).format('DD.MM.YYYY LTS');
                return <span title={date}>{date}</span>
            }
        }, {
            Header: <span title="Дата принятия">Принятие</span>,
            accessor: 'receiveTimestamp',
            filterable: false,
            width: 95,
            Cell: ({value}) => {
                const date = moment(value).format('DD.MM.YYYY LTS');
                return <span title={date}>{date}</span>
            }
        });
        const columnsAcceptedConsignment = columnsConsignment.concat(this.columnsConsignment);
        columnsAcceptedConsignment.push({
            id: 'action',
            Header: <span title="Доступные действия">Действия</span>,
            width: 100,
            Cell: props => <ButtonsTableConsignmentAcceptComponent {...props}/>,
            filterable: false,
            sortable: false,
            resizable: false
        });
        return columnsAcceptedConsignment
    }

    columnsEquipments = [
        {
            id: 'vendorId',
            Header: "Производитель",
            accessor: 'modelId',
            Cell: ({value}) => {
                const vendor = this.modelIdToVendorMap.get(value);
                return <span>{vendor && vendor.name}</span>
            }
        }, {
            id: 'modelId',
            Header: "Модель",
            accessor: 'modelId',
            Cell: ({value}) => {
                const model = this.modelIdToModelMap.get(value);
                return <span>{model && model.name}</span>
            }
        }
    ];

    @computed
    get columnsEquipment() {
        const columnsEquipment = copyObject(this.columnsEquipments);
        columnsEquipment.unshift({
            Header: 'Инв. номер',
            accessor: 'inventoryNumber',
            // ...filterToColumn(this.filters.inventoryNumber)
        }, {
            Header: 'S/N',
            accessor: 'serialNumber',
            // ...filterToColumn(this.filters.serialNumber)
        });
        return columnsEquipment
    }

    @computed
    get columnsConsumables() {
        const columnsConsumables = copyObject(this.columnsEquipments);
        columnsConsumables.push({
            Header: 'Кол-во',
            accessor: 'count',
            // filterable: false
        });
        return columnsConsumables
    }

    @computed
    get columnsEquipmentWithState() {
        const columnsEquipmentWithState = copyObject(this.columnsEquipment);
        columnsEquipmentWithState.push({
            Header: 'Состояние',
            accessor: 'stateId',
            Cell: ({value}) => {
                const state = this.stateIdToStateMap.get(value);
                return <span>{state && state.name}</span>
            }
            // ...filterToColumn(this.filters.stateId)
        });
        return columnsEquipmentWithState
    }

    @computed
    get columnsConsumablesWithState() {
        const columnsConsumablesWithState = copyObject(this.columnsConsumables);
        columnsConsumablesWithState.push({
            Header: 'Состояние',
            accessor: 'stateId',
            Cell: ({value}) => {
                const state = this.stateIdToStateMap.get(value);
                return <span>{state && state.name}</span>
            }
            // ...filterToColumn(this.filters.stateId)
        });
        return columnsConsumablesWithState
    }

    @computed
    get columnsEquipmentAccepted() {
        const columnsEquipmentWithState = copyObject(this.columnsEquipment);
        columnsEquipmentWithState.push({
            Header: 'Статус',
            accessor: 'consignmentState',
            Cell: ({value}) => {
                if (value === consignmentStateEnum.RECEIVED) {
                    return <span>Принят</span>
                }
                return <span>Не принят</span>
            }
            // ...filterToColumn(this.filters.stateId)
        });
        return columnsEquipmentWithState
    }

    @computed
    get columnsConsumablesAccepted() {
        const columnsEquipmentWithState = copyObject(this.columnsEquipments);
        columnsEquipmentWithState.push({
            Header: 'Кол-во',
            accessor: 'consignmentCount',
            // filterable: false
        }, {
            Header: 'Статус',
            accessor: 'consignmentState',
            Cell: ({value}) => {
                if (value === consignmentStateEnum.RECEIVED) {
                    return <span>Принят</span>
                }
                return <span>Не принят</span>
            }
            // ...filterToColumn(this.filters.stateId)
        });
        return columnsEquipmentWithState
    }

    @computed
    get columnsEquipmentActionSend() {
        const columnsEquipmentActionSend = copyObject(this.columnsEquipmentWithState);
        columnsEquipmentActionSend.push({
            id: 'action',
            Header: 'Действия',
            Cell: props => <ButtonsTableEquipmentSendComponent {...props}/>,
            width: 100,
            filterable: false,
            sortable: false,
            resizable: false
        });
        return columnsEquipmentActionSend
    }

    @computed
    get columnsConsumablesActionSend() {
        const columnsConsumablesActionSend = copyObject(this.columnsConsumablesWithState);
        columnsConsumablesActionSend.push({
            id: 'action',
            Header: 'Действия',
            Cell: props => <ButtonsTableConsumablesSendComponent {...props}/>,
            width: 120,
            filterable: false,
            sortable: false,
            resizable: false
        });
        return columnsConsumablesActionSend
    }

    @computed
    get columnsEquipmentActionAccepted() {
        const columnsEquipmentActionAccepted = copyObject(this.columnsEquipmentWithState);
        columnsEquipmentActionAccepted.push({
            id: 'action',
            Header: 'Действия',
            Cell: props => <ButtonsTableEquipmentAcceptConsignmentComponent {...props}/>,
            width: 100,
            filterable: false,
            sortable: false,
            resizable: false
        });
        return columnsEquipmentActionAccepted
    }

    @computed
    get columnsConsumablesActionAccepted() {
        const columnsConsumablesActionAccepted = copyObject(this.columnsConsumablesWithState);
        columnsConsumablesActionAccepted.push({
            id: 'action',
            Header: 'Действия',
            Cell: props => <ButtonsTableConsumablesAcceptedComponent {...props}/>,
            width: 120,
            filterable: false,
            sortable: false,
            resizable: false
        });
        return columnsConsumablesActionAccepted
    }

    //Фильтры
    @observable
    filters = {
        name: new TextFilter('consignment.filters.name')
    };

    @computed
    get filtered() {
        return filtersToFiltered(this.filters);
    }

    pageSize = new SessionStore('consignment.pageSize', 50);

    @action
    handlePageSizeChange = size => {
        this.pageSize.setValue(size);
    };

    page = new SessionStore('consignment.page', 0);

    @action
    handlePageChange = page => {
        this.page.setValue(page);
    };

    //api stores и списки для отрисовки
    constructor() {
        this.consignmentStore = new ConsignmentStore();

        this.locationStore = new LocationStore();
        this.locationStore.loadLocationList();

        this.userStore = new UserStore();
        this.userStore.loadUserList();

        this.consumablesStore = new ConsumablesStore();
        this.equipmentStore = new EquipmentStore();

        this.stateStore = new StateStore();
        this.stateStore.loadStateList();

        this.vendorStore = new VendorStore();
        this.vendorStore.loadVendorList();

        this.modelStore = new ModelStore();
        this.modelStore.loadModelList();
    }

    @action
    loadConsignmentCreatedList() {
        this.consignmentStore.loadConsignmentCreatedList();
    }

    @action
    loadConsignmentSentList() {
        this.consignmentStore.loadConsignmentSentList();
    }

    @action
    loadConsignmentAcceptedList() {
        this.consignmentStore.loadConsignmentAcceptedList();
    }

    @computed
    get stateLoad() {
        return new WatchList(
            this.consignmentStore.consignmentCreatedList,
            this.consignmentStore.consignmentSentList,
            this.consignmentStore.consignmentAcceptedList,
            this.locationStore.locationList,
            this.userStore.userList,
            this.stateStore.stateList,
            this.vendorStore.vendorList,
            this.modelStore.modelList
        )
    }

    @computed
    get consignmentCreatedList() {
        const consignmentCreatedList = this.consignmentStore.consignmentCreatedList;
        return consignmentCreatedList.value;
    }

    @computed
    get consignmentSentList() {
        const consignmentSentList = this.consignmentStore.consignmentSentList;
        return consignmentSentList.value;
    }

    @computed
    get consignmentAcceptedList() {
        const consignmentAcceptedList = this.consignmentStore.consignmentAcceptedList;
        return consignmentAcceptedList.value;
    }

    @computed
    get locationList() {
        const locationList = this.locationStore.locationList;
        return locationList.value;
    }

    @computed
    get locationIdToLocationMap() {
        const map = new Map();
        this.locationList.forEach(item => map.set(item.id, item));
        return map;
    }

    @computed
    get locationIdToParentNameListMap() {
        const map = new Map();
        this.locationList.forEach(item => map.set(item.id, this.locationIdToParentNameList(item.id)));
        return map;
    }

    locationIdToParentNameList(locationId) {
        const parentList = [];
        const location = this.locationIdToLocationMap.get(locationId);
        if (!location.parentId) return parentList;
        if (!location) return parentList;
        const parent = this.locationIdToLocationMap.get(location.parentId);
        parentList.push(parent.name, ...this.locationIdToParentNameList(location.parentId));
        return parentList.reverse()
    }

    @computed
    get locationListToTree() {
        return locationListToTree(this.locationList);
    }

    @computed
    get userList() {
        const userList = this.userStore.userList;
        return userList.value;
    }

    @computed
    get userIdToUserMap() {
        const map = new Map();
        this.userList.forEach(item => {
            map.set(item.id, item)
        });
        return map;
    }

    @computed
    get stateList() {
        const stateList = this.stateStore.stateList;
        return stateList.value;
    }

    @computed
    get stateIdToStateMap() {
        const map = new Map();
        this.stateList.forEach(item => map.set(item.id, item));
        return map;
    }

    @computed
    get vendorList() {
        const vendorList = this.vendorStore.vendorList;
        return vendorList.value;
    }

    @computed
    get modelIdToVendorMap() {
        const map = new Map();
        this.modelList.forEach(m => {
            const vendor = this.vendorList.find(item => item.id === m.vendorId);
            map.set(m.id, vendor);
        });
        return map;
    }

    @computed
    get modelList() {
        const modelList = this.modelStore.modelList;
        return modelList.value;
    }

    @computed
    get modelIdToModelMap() {
        const map = new Map();
        this.modelList.forEach(item => map.set(item.id, item));
        return map;
    }

    //Форма редактирования накладной
    @observable
    consignment = copyDefaultConsignment();

    @action
    setConsignmentCourier(courier) {
        this.consignment.courier = courier;
    }

    @action
    setConsignmentSenderId(userId) {
        this.consignment.senderId = userId;
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

    @observable
    comment = null;

    @action
    setComment(comment) {
        this.comment = comment;
    }

    //Форма принятия накладной
    @observable
    acceptedConsignment = copyObject(defaultAcceptedConsignment);
    acceptedEquipments = observable.map();

    //Проверка прав
    @computed
    get hasAuthorityMove() {
        return authority.SUPER_ADMIN || authority.HARDWARE_MOVE || authority.ANOTHERS_HARDWARE_MOVE
    }

    hasAuthorityAccept(consignment) {
        const {recipient} = consignment;
        return recipient.id === userInfoStore.isAuthorized.id;
    }

    //Окна
    @observable
    modal = null;

    @action
    hideModal() {
        this.modal = null;
    }

    @action
    showModalAddConsignment() {
        this.consignment = copyDefaultConsignment();
        this.modal = 'EDIT_CONSIGNMENT';
    }

    @action
    showModalEditConsignment(consignment) {
        const currentConsignment = copyObject(consignment);
        currentConsignment.recipientId = currentConsignment.recipient.id;
        delete currentConsignment.recipient;
        this.consignment = copyObject(currentConsignment);
        this.modal = modals.ModalEditConsignment;
    }

    @action
    showModalSendConsignment(consignment) {
        this.comment = null;
        this.consignment = copyObject(consignment);
        this.consignmentStore.loadEquipmentList(consignment.id);
        this.consignmentStore.loadConsumablesList(consignment.id);
        this.modal = modals.ModalSendConsignment;
    }

    @action
    showModalSentConsignment(consignment) {
        this.consignment = copyObject(consignment);
        this.consignmentStore.loadEquipmentList(consignment.id);
        this.consignmentStore.loadConsumablesList(consignment.id);
        this.modal = modals.ModalSentConsignment;
    }

    @action
    showModalAcceptConsignment(consignment) {
        this.comment = null;
        this.consignment = copyObject(consignment);
        this.acceptedConsignment.id = consignment.id;
        this.consignmentStore.loadEquipmentList(consignment.id);
        this.consignmentStore.loadConsumablesList(consignment.id);
        this.acceptedEquipments.clear();
        this.modal = modals.ModalAcceptConsignment;
    }

    @action
    showModalAcceptedConsignment(consignment) {
        this.acceptedConsignment.id = consignment.id;
        this.consignmentStore.loadEquipmentList(consignment.id);
        this.consignmentStore.loadConsumablesList(consignment.id);
        this.modal = modals.ModalAcceptedConsignment;
    }

    //Загрузка списка оборудования и расходников
    @computed
    get stateEquipmentAndConsumablesLoad() {
        return new WatchList(
            this.consignmentStore.equipmentList,
            this.consignmentStore.consumablesList
        )
    }

    @computed
    get equipmentList() {
        const equipmentList = this.consignmentStore.equipmentList;
        return equipmentList.value;
    }

    @computed
    get showEquipmentList() {
        return this.equipmentList.length > 0
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

    //Методы

    @action
    handleSaveConsignment() {
        if (this.consignment.id) {
            this.consignmentStore.editConsignment(this.consignment);
        } else {
            this.consignmentStore.createConsignment(this.consignment);
        }
        this.consignment = copyDefaultConsignment();
        this.modal = null;
    }

    @action
    handleDeleteConsignment(id) {
        this.consignmentStore.deleteConsignment(id)
    }

    @action
    handleSendConsignment() {
        this.consignmentStore.sendConsignment(this.consignment.id, this.comment, this.consignment.courier);
        this.modal = null;
    }

    @action
    handleAcceptConsignment() {
        this.acceptedEquipments.forEach(value => {
            this.acceptedConsignment.acceptedEquipments.push(copyObject(value))
        });
        this.consignmentStore.receiveConsignment(this.acceptedConsignment, this.comment);
        this.acceptedEquipments.clear();
        this.modal = null;
    }

    @action
    handleNotAcceptConsignment() {
        this.acceptedEquipments.forEach(value => {
            this.acceptedConsignment.acceptedEquipments.push(copyObject(value))
        });
        this.consignmentStore.receiveConsignment({
            id: this.acceptedConsignment.id,
            acceptedEquipments: []
        }, this.comment);
        this.acceptedEquipments.clear();
        this.modal = null;
    }

    @action
    handleDownloadConsignment() {
        this.consignmentStore.downloadConsignment(this.consignment);
    }

    //Форма отправки накладной
    @action
    handleRemoveEquipment(equipmentId) {
        this.consignmentStore.removeEquipment(equipmentId);
    }

    @action
    handleRemoveConsumables(consumables) {
        this.consignmentStore.removeConsumables(this.consignment.id, consumables);
    }

    //Форма приемки накладной
    @action
    handleAcceptedEquipment(id, checked) {
        if (checked) {
            this.acceptedEquipments.set(id, {id, count: null});
            return
        }
        this.acceptedEquipments.delete(id);
    }

    @action
    handleAcceptedConsumables(id, count) {
        if (count) {
            this.acceptedEquipments.set(id, {id, count: count})
        } else {
            this.acceptedEquipments.delete(id);
        }
    }

}