import React from 'react';
import {mainPage} from 'layout/MainPage';
import {UserViewStore} from '../viewStore/UserViewStore';
import {UserComponent} from '../component/user/UserComponent';
import {Provider} from 'mobx-react';

export class UserController {
    show() {
        const userViewStore = new UserViewStore();

        const props = {
            userViewStore
        };

        const content = (
            <Provider {...props}>
                <UserComponent/>
            </Provider>
        );

        return () => {
            return mainPage(content);
        }
    }
}