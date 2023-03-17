import React from 'react';
import {mainPage} from 'layout/MainPage';
import {ConsignmentViewStore} from '../viewStore/ConsignmentViewStore';
import {ConsignmentComponent} from '../component/consignment/ConsignmentComponent';
import {Provider} from 'mobx-react';

export class ConsignmentController {
    show() {
        const consignmentViewStore = new ConsignmentViewStore();
        consignmentViewStore.loadConsignmentCreatedList();

        const props = {
            consignmentViewStore
        };

        const content = (
            <Provider {...props}>
                <ConsignmentComponent/>
            </Provider>
        );

        return () => {
            return mainPage(content);
        }
    }
}