import {action} from 'mobx';
import {Request} from 'utils/Request';

export class ReportsStore {
    @action
    movingReport(startDate, endDate) {
        const loadReport = async () => {
            await Request.postDownloadFile('/api/report/moving-report', {startDate, endDate})
        };
        loadReport();
    }

    @action
    serviceCenterReport(startDate, endDate, delayDays) {
        const loadReport = async () => {
            await Request.postDownloadFile('/api/report/service-center-report', {startDate, endDate, delayDays})
        };
        loadReport();
    }

}