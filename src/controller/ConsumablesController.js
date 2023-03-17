import {ConsumablesComponent} from 'component/consumables/ConsumablesComponent';
import {mainPage} from 'layout/MainPage';
import {Provider} from 'mobx-react';
import React from 'react';
import {ConsumablesViewStore} from 'viewStore/ConsumablesViewStore';

export class ConsumablesController {
    show() {
        const consumablesViewStore = new ConsumablesViewStore();

        const props = {
            consumablesViewStore
        };

        const content = (
            <Provider {...props}>
                <ConsumablesComponent/>
            </Provider>
        );

        return () => {
            return mainPage(content);
        }
    }
}