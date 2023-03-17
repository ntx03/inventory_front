import {action, observable, toJS} from 'mobx';
import {fromPromise} from 'mobx-utils';
import {Request} from 'utils/Request';

export class ConsumablesStore {
    @observable consumables = fromPromise.resolve({});
    @observable consumablesList = fromPromise.resolve([]);

    @action
    loadConsumablesList() {
        this.consumablesList = fromPromise(Request.post('/api/consumables/list'))
    }

    @action
    loadConsumables(id) {
        this.consumables = fromPromise(Request.post('/api/consumables/list', {id}))
    }

    @action
    addConsumables(consumables) {
        const consumablesList = this.consumablesList.value;
        const addConsumables = async () => {
            const newConsumables = await Request.post('/api/consumables/add', toJS(consumables));
            const oldConsumablesIndex = consumablesList.findIndex(c => c.id === newConsumables.id);
            if (oldConsumablesIndex >= 0) {
                consumablesList[oldConsumablesIndex] = newConsumables;
            } else {
                consumablesList.push(newConsumables);
            }
            return consumablesList
        };
        this.consumablesList = fromPromise(addConsumables())
    }

    @action
    editConsumables(consumables) {
        const consumablesList = this.consumablesList.value;
        const addConsumables = async () => {
            const editConsumables = await Request.post('/api/consumables/edit', toJS(consumables));
            if (editConsumables.id !== consumables.id) {
                const oldConsumablesIndex = consumablesList.findIndex(c => c.id === consumables.id);
                consumablesList.splice(oldConsumablesIndex, 1);
            }
            const editConsumablesIndex = consumablesList.findIndex(c => c.id === editConsumables.id);
            consumablesList[editConsumablesIndex] = editConsumables;
            return consumablesList
        };
        this.consumablesList = fromPromise(addConsumables())
    }

    @action
    deleteConsumables(id) {
        const consumablesList = this.consumablesList.value;
        const deleteConsumables = async () => {
            await Request.post('/api/consumables/delete', {id});
            return consumablesList.filter(item => item.id !== id);
        };
        this.consumablesList = fromPromise(deleteConsumables())
    }

    @action
    changeStateConsumables({id, stateId, count, comment}) {
        let consumablesList = this.consumablesList.value;
        let consumablesId = id;
        const changeStateConsumables = async () => {
            const editedConsumables = await Request.post('/api/consumables/change-state',
                {id, stateId, count, comment}
            );
            if (editedConsumables.id === consumablesId) {
                return consumablesList.map(item => {
                    if (item.id === editedConsumables.id) {
                        return editedConsumables
                    }
                    return item
                })
            }
            let mustPush = true;
            consumablesList = consumablesList.filter(item => {
                if (item.id === consumablesId) {
                    return item.count !== count
                }
                return true
            }).map(item => {
                if (item.id === consumablesId) {
                    return {...item, count: item.count - count}
                }
                if (item.id === editedConsumables.id) {
                    mustPush = false;
                    return editedConsumables
                }
                return item
            });
            mustPush && consumablesList.push(editedConsumables);
            return consumablesList
        };
        this.consumablesList = fromPromise(changeStateConsumables())
    }

    @action
    editConsignmentConsumables({consumablesId, consignmentId, count}) {
        let consumablesList = this.consumablesList.value;
        const changeStateConsumables = async () => {
            const editedConsumables = await Request.post('/api/consumables/consignment/add',
                {consumablesId, consignmentId, count}
            );
            if (editedConsumables.id === consumablesId) {
                return consumablesList.map(item => {
                    if (item.id === editedConsumables.id) {
                        return editedConsumables
                    }
                    return item
                })
            }
            let mustPush = true;
            consumablesList = consumablesList.filter(item => {
                if (item.id === consumablesId) {
                    return item.count !== count
                }
                return true
            }).map(item => {
                if (item.id === consumablesId) {
                    return {...item, count: item.count - count}
                }
                if (item.id === editedConsumables.id) {
                    mustPush = false;
                    return editedConsumables
                }
                return item
            });
            mustPush && consumablesList.push(editedConsumables);
            return consumablesList
        };
        this.consumablesList = fromPromise(changeStateConsumables())
    }

    @action
    removeConsignmentConsumables({consumablesId, consignmentId, count}) {
        let consumablesList = this.consumablesList.value;
        const removeConsignmentConsumables = async () => {
            const editedConsumables = await Request.post('/api/consumables/consignment/remove',
                {consumablesId, consignmentId, count}
            );
            if (editedConsumables.id === consumablesId) {
                return consumablesList.map(item => {
                    if (item.id === editedConsumables.id) {
                        return editedConsumables
                    }
                    return item
                })
            }
            let mustPush = true;
            consumablesList = consumablesList.filter(item => {
                if (item.id === consumablesId) {
                    return item.count !== count
                }
                return true
            }).map(item => {
                if (item.id === consumablesId) {
                    return {...item, count: item.count - count}
                }
                if (item.id === editedConsumables.id) {
                    mustPush = false;
                    return editedConsumables
                }
                return item
            });
            mustPush && consumablesList.push(editedConsumables);
            return consumablesList
        };
        this.consumablesList = fromPromise(removeConsignmentConsumables())
    }

}