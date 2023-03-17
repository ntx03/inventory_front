import {ModalEditGroupsUserComponent, ModalEditLocationsUserComponent} from 'component/user/ModalUserComponent';
import {LayoutContent} from 'layout/LayoutContent';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {ErrorComponent} from '../base/ErrorComponent';
import {LoadingComponent} from '../base/LoadingComponent';
import {TableUserComponent} from './TableUserComponent';

@inject('userViewStore')
@observer
export class UserComponent extends React.Component {
    render() {
        const {userViewStore} = this.props;
        if (userViewStore.stateLoad.pending) {
            return <LoadingComponent/>
        }
        if (userViewStore.stateLoad.errors) {
            return <ErrorComponent errors={userViewStore.stateLoad.errors}/>
        }
        return (
            <LayoutContent title='Пользователи'>
                <TableUserComponent/>
                <ModalEditGroupsUserComponent/>
                <ModalEditLocationsUserComponent/>
            </LayoutContent>
        )
    }
}