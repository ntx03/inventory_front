import {action, observable} from "mobx";

export class ModalStore {
    @observable title;
    @observable parameterShow;
    @observable element;

    @action
    elementAdd(title, element) {
        this.title = title;
        this.parameterShow = true;
        this.element = element;
    }

    @action
    show() {
        this.parameterShow = true;
    }

    @action
    hide() {
        this.element = {};
        this.parameterShow = false;
    }

}

export const modalStore = new ModalStore();