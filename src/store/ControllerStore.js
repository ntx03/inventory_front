import _ from 'lodash';
import {action, computed, observable, reaction, runInAction} from 'mobx';
import {routerStore} from './RouterStore';
import {userInfoStore} from './UserInfoStore';

function getController(controllerName) {
    const camelCaseName = _.camelCase(controllerName);
    const capitalizedName = camelCaseName.replace(/^./, _.capitalize(camelCaseName[0]));
    const className = capitalizedName + 'Controller';
    try {
        return require('controller/' + className)[className];
    } catch (e) {
        console.error(e);
        return null;
    }
}

export class ControllerStore {
    @observable controllerName = routerStore.route.name;
    @observable controllerParams = routerStore.route.params;
    @observable controllerInitParams = {};

    constructor() {
        reaction(() => ({
            controllerName: routerStore.route.name,
            controllerParams: routerStore.route.params
        }), this._handleRouterChange);
    }

    @computed
    get renderFunction() {
        let controllerName = this.controllerName;
        if (!userInfoStore.isAuthorized) {
            controllerName = 'login';
        }
        const Controller = getController(controllerName) || getController('notFound');
        const controller = new Controller(this.controllerParams, {
            ...this.controllerInitParams,
            navigate: this.navigate
        });
        return controller.show();
    }

    navigate = (name, params = {}, initParams = {}) => {
        runInAction(() => {
            this.controllerName = name;
            this.controllerParams = params;
            this.controllerInitParams = initParams;
        });
        routerStore.router.navigate(name, params);
    };

    @action
    _handleRouterChange = ({controllerName, controllerParams}) => {
        if (_.isEqual(this.controllerName, controllerName) &&
            _.isEqual(this.controllerParams, controllerParams)) {
            return;
        }
        this.controllerName = controllerName;
        this.controllerParams = controllerParams;
        this.controllerInitParams = {};
    };
}
