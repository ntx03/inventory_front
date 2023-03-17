import React from 'react';
import {mainPage} from 'layout/MainPage';
import {ProviderViewStore} from '../viewStore/ProviderViewStore';
import {ProviderComponent} from '../component/provider/ProviderComponent';
import {Provider} from 'mobx-react';

export class ProviderController {
    show() {
        const providerViewStore = new ProviderViewStore();

        const props = {
            providerViewStore
        };

        const content = (
            <Provider {...props}>
                <ProviderComponent/>
            </Provider>
        );

        return () => {
            return mainPage(content);
        }
    }
}