import React from 'react';
import {mainPage} from 'layout/MainPage';
import {Provider} from "mobx-react";
import {EquipmentJournalComponent} from "component/equipment/EquipmentJournalComponent";
import {EquipmentJournalViewStore} from "viewStore/EquipmentJournalViewStore";

export class EquipmentJournalController {
    show() {
        const equipmentJournalViewStore = new EquipmentJournalViewStore();

        const props = {
            equipmentJournalViewStore
        };

        const content = (
            <Provider {...props}>
                <EquipmentJournalComponent/>
            </Provider>
        );

        return () => {
            return mainPage(content);
        }
    }
}