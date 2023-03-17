import React from 'react';
import {mainPage} from 'layout/MainPage';
import {Provider} from 'mobx-react';
import {ModelComponent} from '../component/model/ModelComponent';
import {ModelViewStore} from '../viewStore/ModelViewStore';

export class ModelController {
    show() {
        const modelViewStore = new ModelViewStore();

        const props = {
            modelViewStore
        };

        const content = (
            <Provider {...props}>
                <ModelComponent/>
            </Provider>
        );

        return () => {
            return mainPage(content);
        }
    }
}