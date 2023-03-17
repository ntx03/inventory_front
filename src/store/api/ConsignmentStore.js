import {action, observable, toJS} from 'mobx';
import {fromPromise} from 'mobx-utils';
import {Request} from 'utils/Request';

export class ConsignmentStore {
    @observable
    consignmentCreatedList = fromPromise.resolve([]);

    @observable
    consignmentSentList = fromPromise.resolve([]);

    @observable
    consignmentAcceptedList = fromPromise.resolve([]);

    @observable
    consignment = fromPromise.resolve({});

    @observable
    consumablesList = fromPromise.resolve([]);

    @observable
    equipmentList = fromPromise.resolve([]);

    @action
    loadConsignmentCreatedList() {
        this.consignmentCreatedList = fromPromise(Request.post('/api/consignment/created'))
    }

    @action
    loadConsignmentSentList() {
        this.consignmentSentList = fromPromise(Request.post('/api/consignment/sent'))
    }

    @action
    loadConsignmentAcceptedList() {
        this.consignmentAcceptedList = fromPromise(Request.post('/api/consignment/accepted'))
    }

    @action
    loadConsignment(consignmentId) {
        this.consignment = fromPromise(Request.post('/api/consignment/get', {id: consignmentId}))
    }

    @action
    createConsignment(consignment) {
        const consignmentList = this.consignmentCreatedList.value;
        const createdConsignment = async () => {
            const newConsignment = await Request.post('/api/consignment/create', toJS(consignment));
            consignmentList.unshift(newConsignment);
            return consignmentList
        };
        this.consignmentCreatedList = fromPromise(createdConsignment())
    }

    @action
    editConsignment(consignment) {
        const consignmentList = this.consignmentCreatedList.value;
        const editConsignment = async () => {
            const editConsignment = await Request.post('/api/consignment/edit', toJS(consignment));
            return consignmentList.map(item => {
                if (item.id === consignment.id) {
                    return editConsignment
                }
                return item
            });
        };
        this.consignmentCreatedList = fromPromise(editConsignment());
    };

    @action
    deleteConsignment(consignmentId) {
        const consignmentList = this.consignmentCreatedList.value;
        const deleteConsignment = async () => {
            await Request.post('/api/consignment/delete', {
                id: consignmentId
            });
            return consignmentList.filter(item => item.id !== consignmentId);
        };
        this.consignmentCreatedList = fromPromise(deleteConsignment())
    }

    @action
    sendConsignment(consignmentId, comment, courier) {
        const consignmentList = this.consignmentCreatedList.value;
        const sendConsignment = async () => {
            await Request.post('/api/consignment/send', {
                id: consignmentId,
                comment: comment,
                courier: courier
            });
            await Request.postDownloadFile('/api/consignment/file', {id: consignmentId});
            return consignmentList.filter(item => item.id !== consignmentId);
        };
        this.consignmentCreatedList = fromPromise(sendConsignment())
    }

    @action
    receiveConsignment({id, acceptedEquipments}, comment) {
        const consignmentSentList = this.consignmentSentList.value;
        const receiveConsignment = async () => {
            await Request.post('/api/consignment/receive', {id, acceptedEquipments, comment});
            return consignmentSentList.filter(item => item.id !== id);
        };
        this.consignmentSentList = fromPromise(receiveConsignment())
    }

    @action
    loadEquipmentList(consignmentId) {
        this.equipmentList = fromPromise(Request.post('/api/consignment/equipments/show', {id: consignmentId}))
    }

    @action
    removeEquipment(equipmentId) {
        const equipmentList = this.equipmentList.value;
        const deleteEquipment = async () => {
            await Request.post('/api/equipment/consignment/add', {equipmentsId: [equipmentId], consignmentId: null});
            return equipmentList.filter(item => item.id !== equipmentId)
        };
        this.equipmentList = fromPromise(deleteEquipment())
    }

    @action
    loadConsumablesList(consignmentId) {
        this.consumablesList = fromPromise(Request.post('/api/consignment/consumables/show', {id: consignmentId}))
    }

    @action
    removeConsumables(consignmentId, {consumablesId, count}) {
        const consumablesList = this.consumablesList.value;
        const removeConsignmentConsumables = async () => {
            await Request.post('/api/consumables/consignment/remove',
                {consumablesId, consignmentId, count}
            );
            return consumablesList.filter(item => {
                if (item.id === consumablesId) {
                    return item.count !== count
                }
                return true
            }).map(item => {
                if (item.id === consumablesId) {
                    return {
                        ...item,
                        count: item.count - count
                    }
                }
                return item
            });
        };
        this.consumablesList = fromPromise(removeConsignmentConsumables())
    }

    @action
    downloadConsignment({id}) {
        const downloadConsignment = async () => {
            await Request.postDownloadFile('/api/consignment/file', {id})
        };
        downloadConsignment();
    }
}