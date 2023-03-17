import React from 'react';
import {mainPage} from 'layout/MainPage';
import {Provider} from 'mobx-react';
import {LocationComponent} from '../component/location/LocationComponent';
import {LocationViewStore} from '../viewStore/LocationViewStore';

export class LocationController {
    show() {
        const locationViewStore = new LocationViewStore();

        const props = {
            locationViewStore
        };

        const content = (
            <Provider {...props}>
                <LocationComponent/>
            </Provider>
        );

        return () => {
            return mainPage(content);
        }
    }
}