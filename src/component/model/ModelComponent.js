import {ButtonsTitleModelComponent} from 'component/model/ButtonsTitleModelComponent';
import {LayoutContent} from 'layout/LayoutContent';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {ErrorComponent} from '../base/ErrorComponent';
import {LoadingComponent} from '../base/LoadingComponent';
import {TableModelComponent} from './TableModelComponent';
import {ModalModelComponent} from './ModalModelComponent';

@inject('modelViewStore')
@observer
export class ModelComponent extends React.Component {
    render() {
        const {modelViewStore} = this.props;
        if (modelViewStore.stateLoad.pending) {
            return <LoadingComponent/>
        }
        if (modelViewStore.stateLoad.errors) {
            return <ErrorComponent errors={modelViewStore.stateLoad.errors}/>
        }
        return (
            <LayoutContent title='Модели'
                           buttons={<ButtonsTitleModelComponent/>}
            >
                <TableModelComponent/>
                <ModalModelComponent/>
            </LayoutContent>
        )
    }
}