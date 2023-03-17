import {action, observable, toJS} from "mobx";
import {fromPromise} from "mobx-utils";
import {Request} from "utils/Request";

export class HardwareTypeStore {
    @observable
    hardwareTypeList = fromPromise.resolve([]);

    @observable
    hardwareType = fromPromise.resolve({});

    @action
    loadHardwareTypeList() {
        this.hardwareTypeList = fromPromise(Request.post('/api/hardware-type/list'))
    }

    @action
    loadHardwareType(id){
        this.hardwareType = fromPromise(Request.post('/api/hardware-type/get', id))
    }

    @action
    addHardwareType(hardwareType) {
        const hardwareTypeList = this.hardwareTypeList.value;
        const addHardwareType = async () => {
            const newHardwareType = await Request.post('/api/hardware-type/add', hardwareType);
             hardwareTypeList.push(newHardwareType);
            return hardwareTypeList
        };
        this.hardwareTypeList = fromPromise(addHardwareType())
    }

    @action
    editHardwareType(hardwareType) {
        const hardwareTypeList = this.hardwareTypeList.value;
        const editHardwareType = async () => {
            await Request.post('/api/hardware-type/edit', toJS(hardwareType));
            return hardwareTypeList.map(item => {
                if (item.id === hardwareType.id) {
                    return hardwareType
                }
                return item
            });
        };
        this.hardwareTypeList = fromPromise(editHardwareType());
    }

    @action
    deleteHardwareType(hardwareTypeId) {
        const hardwareTypeList = this.hardwareTypeList.value;
        const deleteVendor = async () => {
            await Request.post('/api/hardware-type/delete', {
                id: hardwareTypeId
            });
            return hardwareTypeList.filter(item => item.id !== hardwareTypeId);
        };
        this.hardwareTypeList = fromPromise(deleteVendor())
    }

}