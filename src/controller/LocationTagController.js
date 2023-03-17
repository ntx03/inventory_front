import React from 'react';
import {mainPage} from 'layout/MainPage';
import {LocationTagViewStore} from '../viewStore/LocationTagViewStore';
import {LocationTagComponent} from '../component/locationTag/LocationTagComponent';
import {Provider} from 'mobx-react';

export class LocationTagController {
    show() {
        const locationTagViewStore = new LocationTagViewStore();

        const props = {
            locationTagViewStore
        };

        const content = (
            <Provider {...props}>
                <LocationTagComponent/>
            </Provider>
        );

        return () => {
            return mainPage(content);
        }
    }
}