import {action, observable, toJS} from 'mobx';
import {fromPromise} from 'mobx-utils';
import {Request} from 'utils/Request';
import moment from 'moment';

export class EquipmentStore {
    @observable equipment = fromPromise.resolve({});
    @observable equipmentList = fromPromise.resolve([]);
    @observable equipmentHistory = fromPromise.resolve({});
    @observable equipmentJournal = fromPromise.resolve([]);

    @action
    loadEquipmentList() {
        this.equipmentList = fromPromise(Request.post('/api/equipment/list'))
    }

    @action
    loadEquipment(id) {
        this.equipment = fromPromise(Request.post('/api/equipment/list', {id}))
    }

    @action
    loadEquipmentHistory(id) {
        const getEquipmentHistory = async () => {
            const equipmentHistory = await Request.post('/api/equipment/history', {id});
            return equipmentHistory.reverse()
        };
        this.equipmentHistory = fromPromise(getEquipmentHistory())
    }

    @action
    addEquipment(equipment) {
        const equipmentList = this.equipmentList.value;
        const addEquipment = async () => {
            const newEquipment = await Request.post('/api/equipment/add', toJS(equipment));
            equipmentList.push(newEquipment);
            return equipmentList
        };
        this.equipmentList = fromPromise(addEquipment())
    }

    @action
    editEquipment(equipment) {
        const equipmentList = this.equipmentList.value;
        const addEquipment = async () => {
            await Request.post('/api/equipment/edit', toJS(equipment));
            return equipmentList.map(item => {
                if (item.id === equipment.id) {
                    return equipment
                }
                return item
            })
        };
        this.equipmentList = fromPromise(addEquipment())
    }

    @action
    deleteEquipment(id) {
        const equipmentList = this.equipmentList.value;
        const deleteEquipment = async () => {
            await Request.post('/api/equipment/delete', {id});
            return equipmentList.filter(item => item.id !== id);
        };
        this.equipmentList = fromPromise(deleteEquipment())
    }

    @action
    changeStateEquipment(equipmentsId, stateId, comment) {
        const equipmentList = this.equipmentList.value;
        const changeStateEquipment = async () => {
            await Request.post('/api/equipment/change-state', {equipmentsId, stateId, comment});
            return equipmentList.map(item => {
                if (equipmentsId.includes(item.id)) {
                    return {
                        ...item,
                        stateId: stateId
                    }
                }
                return item
            });
        };
        this.equipmentList = fromPromise(changeStateEquipment())
    }

    @action
    consignmentIdEquipmentAdd(equipmentsId, consignmentId) {
        const equipmentList = this.equipmentList.value;
        const consignmentAddEquipment = async () => {
            const map = new Map();
            const editEquipmentList = await Request.post('/api/equipment/consignment/add', {
                equipmentsId,
                consignmentId
            });
            editEquipmentList.forEach(item => map.set(item.id, item));
            return equipmentList.map(item => {
                if (map.get(item.id)) {
                    return map.get(item.id)
                }
                return item
            });
        };
        this.equipmentList = fromPromise(consignmentAddEquipment())
    }

    @action
    loadEquipmentJournal(startDate, endDate) {
        const getEquipmentJournal = async () => {
            return await Request.post('/api/equipment-journal/get', {
                startDate: startDate,
                endDate: endDate
            });
        };
        this.equipmentJournal = fromPromise(getEquipmentJournal());
    }

}