import React from 'react';
import {mainPage} from 'layout/MainPage';
import {GroupViewStore} from '../viewStore/GroupViewStore';
import {GroupComponent} from '../component/group/GroupComponent';
import {Provider} from 'mobx-react';

export class GroupController {
    show() {
        const groupViewStore = new GroupViewStore();

        const props = {
            groupViewStore
        };

        const content = (
            <Provider {...props}>
                <GroupComponent/>
            </Provider>
        );

        return () => {
            return mainPage(content);
        }
    }
}