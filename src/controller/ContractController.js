import React from 'react';
import {mainPage} from 'layout/MainPage';
import {ContractViewStore} from '../viewStore/ContractViewStore';
import {ContractComponent} from '../component/contract/ContractComponent';
import {Provider} from 'mobx-react';

export class ContractController {
    show() {
        const contractViewStore = new ContractViewStore();

        const props = {
            contractViewStore
        };

        const content = (
            <Provider {...props}>
                <ContractComponent/>
            </Provider>
        );

        return () => {
            return mainPage(content);
        }
    }
}