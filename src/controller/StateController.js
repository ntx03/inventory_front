import React from 'react';
import {mainPage} from 'layout/MainPage';
import {StateViewStore} from '../viewStore/StateViewStore';
import {StateComponent} from '../component/state/StateComponent';
import {Provider} from 'mobx-react';

export class StateController {
    show() {
        const stateViewStore = new StateViewStore();

        const props = {
            stateViewStore
        };

        const content = (
            <Provider {...props}>
                <StateComponent/>
            </Provider>
        );

        return () => {
            return mainPage(content);
        }
    }
}