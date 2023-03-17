import {ConsignmentAcceptedComponent} from 'component/consignment/ConsignmentAcceptedComponent';
import React from 'react';
import {mainPage} from 'layout/MainPage';
import {Provider} from 'mobx-react';
import {ConsignmentViewStore} from 'viewStore/ConsignmentViewStore';

export class ConsignmentAcceptedController {
    show() {
        const consignmentViewStore = new ConsignmentViewStore();
        consignmentViewStore.loadConsignmentAcceptedList();

        const props = {
            consignmentViewStore
        };

        const content = (
            <Provider {...props}>
                <ConsignmentAcceptedComponent/>
            </Provider>
        );

        return () => {
            return mainPage(content);
        }
    }
}