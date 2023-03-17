import {ButtonsTitleStateComponent} from 'component/state/ButtonsTitleStateComponent';
import {LayoutContent} from 'layout/LayoutContent';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {ErrorComponent} from '../base/ErrorComponent';
import {LoadingComponent} from '../base/LoadingComponent';
import {TableStateComponent} from './TableStateComponent';
import {ModalStateComponent} from './ModalStateComponent';

@inject('stateViewStore')
@observer
export class StateComponent extends React.Component {
    render() {
        const {stateViewStore} = this.props;
        if (stateViewStore.stateLoad.pending) {
            return <LoadingComponent/>
        }
        if (stateViewStore.stateLoad.errors) {
            return <ErrorComponent errors={stateViewStore.stateLoad.errors}/>
        }
        return (
            <LayoutContent title='Состояния'
                           buttons={<ButtonsTitleStateComponent/>}
            >
                <TableStateComponent/>
                <ModalStateComponent/>
            </LayoutContent>
        )
    }
}