import {action, computed, observable} from 'mobx';
import React from 'react';
import {ReportsStore} from 'store/api/ReportsStore';
import {authority} from 'utils/Authority';


export class ReportsViewStore {

    constructor() {
        this.reportsStore = new ReportsStore();
    }

    @observable
    modal = null;

    @action
    hideModal() {
        this.modal = null;
    }

    @computed
    get hasAuthorityMovingReport() {
        return authority.MOVING_REPORT_VIEW
    };

    @computed
    get hasAuthorityServiceCenterReport() {
        return authority.SERVICE_CENTER_REPORT_VIEW
    };

    handleMovingReport = (startDate, endDate) => {
        this.reportsStore.movingReport(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
    };

    handleServiceCenterReport = (startDate, endDate, delayDays) => {
        this.reportsStore.serviceCenterReport(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'), delayDays);
    };

}