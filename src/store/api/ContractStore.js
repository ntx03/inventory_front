import {action, observable, toJS} from 'mobx';
import {fromPromise} from 'mobx-utils';
import {Request} from 'utils/Request';

export class ContractStore {
    @observable
    contractList = fromPromise.resolve([]);

    @observable
    contract = fromPromise.resolve({});

    @action
    loadContractList() {
        this.contractList = fromPromise(Request.post('/api/contract/list'))
    }

    @action
    loadContract(id) {
        this.contract = fromPromise(Request.post('/api/contract/get', id))
    }

    @action
    addContract(contract) {
        const contractList = this.contractList.value;
        const addContract = async () => {
            const newContract = await Request.post('/api/contract/add', toJS(contract));
            contractList.push(newContract);
            return contractList
        };
        this.contractList = fromPromise(addContract())
    }

    @action
    editContract(contract) {
        const contractList = this.contractList.value;
        const editContract = async () => {
            await Request.post('/api/contract/edit', toJS(contract));
            return contractList.map(item => {
                if (item.id === contract.id) {
                    return contract
                }
                return item
            });
        };
        this.contractList = fromPromise(editContract());
    };

    @action
    deleteContract(contractId) {
        const contractList = this.contractList.value;
        const deleteContract = async () => {
            await Request.post('/api/contract/delete', {
                id: contractId
            });
            return contractList.filter(item => item.id !== contractId);
        };
        this.contractList = fromPromise(deleteContract())
    }

}