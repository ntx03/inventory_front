import {action, observable, toJS} from 'mobx';
import {fromPromise} from 'mobx-utils';
import {Request} from 'utils/Request';

export class StateStore {
    @observable
    stateList = fromPromise.resolve([]);

    @observable
    state = fromPromise.resolve({});

    @action
    loadStateList() {
        this.stateList = fromPromise(Request.post('/api/state/list'))
    }

    @action
    loadState(id) {
        this.state = fromPromise(Request.post('/api/state/get', id))
    }

    @action
    addState(state) {
        const stateList = this.stateList.value;
        const addState = async () => {
            const newState = await Request.post('/api/state/add', toJS(state));
            stateList.push(newState);
            return stateList
        };
        this.stateList = fromPromise(addState())
    }

    @action
    editState(state) {
        const stateList = this.stateList.value;
        const editState = async () => {
            await Request.post('/api/state/edit', toJS(state));
            return stateList.map(item => {
                if (item.id === state.id) {
                    return state
                }
                return item
            });
        };
        this.stateList = fromPromise(editState());
    };

    @action
    deleteState(stateId) {
        const stateList = this.stateList.value;
        const deleteState = async () => {
            await Request.post('/api/state/delete', {
                id: stateId
            });
            return stateList.filter(item => item.id !== stateId);
        };
        this.stateList = fromPromise(deleteState())
    }

}