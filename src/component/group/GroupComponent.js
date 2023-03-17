import {ButtonsTitleGroupComponent} from 'component/group/ButtonsTitleGroupComponent';
import {LayoutContent} from 'layout/LayoutContent';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {ErrorComponent} from '../base/ErrorComponent';
import {LoadingComponent} from '../base/LoadingComponent';
import {TableGroupComponent} from './TableGroupComponent';
import {ModalGroupComponent} from './ModalGroupComponent';

@inject('groupViewStore')
@observer
export class GroupComponent extends React.Component {
    render() {
        const {groupViewStore} = this.props;
        if (groupViewStore.stateLoad.pending) {
            return <LoadingComponent/>
        }
        if (groupViewStore.stateLoad.errors) {
            return <ErrorComponent errors={groupViewStore.stateLoad.errors}/>
        }
        return (
            <LayoutContent title='Группы'
                           buttons={<ButtonsTitleGroupComponent/>}
            >
                <TableGroupComponent/>
                <ModalGroupComponent/>
            </LayoutContent>
        )
    }
}