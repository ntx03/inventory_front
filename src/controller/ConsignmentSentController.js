import {ConsignmentSentComponent} from 'component/consignment/ConsignmentSentComponent';
import {mainPage} from 'layout/MainPage';
import {Provider} from 'mobx-react';
import React from 'react';
import {ConsignmentViewStore} from 'viewStore/ConsignmentViewStore';

export class ConsignmentSentController {
    show() {
        const consignmentViewStore = new ConsignmentViewStore();
        consignmentViewStore.loadConsignmentSentList();

        const props = {
            consignmentViewStore
        };

        const content = (
            <Provider {...props}>
                <ConsignmentSentComponent/>
            </Provider>
        );

        return () => {
            return mainPage(content);
        }
    }
}