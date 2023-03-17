import React from 'react';
import {mainPage} from 'layout/MainPage';
import {EquipmentComponent} from "component/equipment/EquipmentComponent";
import {Provider} from "mobx-react";
import {EquipmentViewStore} from "viewStore/EquipmentViewStore";

export class EquipmentController {
    show() {
        const equipmentViewStore = new EquipmentViewStore();

        const props = {
            equipmentViewStore
        };

        const content = (
            <Provider {...props}>
                <EquipmentComponent/>
            </Provider>
        );

        return () => {
            return mainPage(content);
        }
    }
}