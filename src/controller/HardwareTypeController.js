import React from 'react';
import {mainPage} from 'layout/MainPage';
import {HardwareTypeComponent} from '../component/hardwareType/HardwareTypeComponent';
import {Provider} from 'mobx-react';
import {HardwareTypeViewStore} from '../viewStore/HardwareTypeViewStore';

export class HardwareTypeController {
    show() {
        const hardwareTypeViewStore = new HardwareTypeViewStore();

        const props = {
            hardwareTypeViewStore
        };

        const content = (
            <Provider {...props}>
                <HardwareTypeComponent/>
            </Provider>
        );

        return () => {
            return mainPage(content);
        }
    }
}