import {ReportsComponent} from 'component/reports/ReportsComponent';
import {mainPage} from 'layout/MainPage';
import {Provider} from 'mobx-react';
import React from 'react';
import {ReportsViewStore} from 'viewStore/ReportsViewStore';

export class ReportsController {
    show() {
        const reportsViewStore = new ReportsViewStore();

        const props = {
            reportsViewStore
        };

        const content = (
            <Provider {...props}>
                <ReportsComponent/>
            </Provider>
        );

        return () => {
            return mainPage(content);
        }
    }
}