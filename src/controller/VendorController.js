import React from 'react';
import {mainPage} from 'layout/MainPage';
import {VendorViewStore} from '../viewStore/VendorViewStore';
import {VendorComponent} from '../component/vendor/VendorComponent';
import {Provider} from 'mobx-react';

export class VendorController {
    show() {
        const vendorViewStore = new VendorViewStore();

        const props = {
            vendorViewStore
        };

        const content = (
            <Provider {...props}>
                <VendorComponent/>
            </Provider>
        );

        return () => {
            return mainPage(content);
        }
    }
}