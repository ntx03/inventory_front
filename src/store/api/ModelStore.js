import {action, observable} from 'mobx';
import {fromPromise} from 'mobx-utils';
import {Request} from 'utils/Request';

export class ModelStore {
    @observable
    modelList = fromPromise.resolve([]);

    @observable
    model = fromPromise.resolve({});

    @action
    loadModelList() {
        this.modelList = fromPromise(Request.post('/api/model/list'))
    }

    @action
    loadModel(id){
        this.model = fromPromise(Request.post('/api/model/get', id))
    }

    @action
    addModel(model) {
        const modelList = this.modelList.value;
        const addModel = async () => {
            const newModel = await Request.post('/api/model/add', model);
            modelList.push(newModel);
            return modelList;
        };
        this.modelList = fromPromise(addModel())
    }

    @action
    editModel(model) {
        const modelList = this.modelList.value;
        const editModel = async () => {
            const newModel = await Request.post('/api/model/edit', model);
            return modelList.map(item => {
                if (item.id === model.id) {
                    return newModel
                }
                return item
            });
        };
        this.modelList = fromPromise(editModel());
    }

    @action
    deleteModel(modelId) {
        const modelList = this.modelList.value;
        const deleteVendor = async () => {
            await Request.post('/api/model/delete', {
                id: modelId
            });
            return modelList.filter(item => item.id !== modelId);
        };
        this.modelList = fromPromise(deleteVendor())
    }

}