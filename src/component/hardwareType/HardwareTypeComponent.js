import {ButtonsTitleHardwareTypeComponent} from 'component/hardwareType/ButtonsTitleHardwareTypeComponent';
import React from 'react';
import {LayoutContent} from 'layout/LayoutContent';
import {inject, observer} from 'mobx-react';
import {LoadingComponent} from '../base/LoadingComponent';
import {ErrorComponent} from '../base/ErrorComponent';
import {TableHardwareTypeComponent} from './TableHardwareTypeComponent';
import {ModalHardwareTypeComponent} from './ModalHardwareTypeComponent';

@inject('hardwareTypeViewStore')
@observer
export class HardwareTypeComponent extends React.Component {
    render() {
        const {hardwareTypeViewStore} = this.props;
        if (hardwareTypeViewStore.stateLoad.pending) {
            return <LoadingComponent/>
        }
        if (hardwareTypeViewStore.stateLoad.errors) {
            return <ErrorComponent errors={hardwareTypeViewStore.stateLoad.errors}/>
        }
        return (
            <LayoutContent title='Типы оборудования'
                           buttons={<ButtonsTitleHardwareTypeComponent/>}
            >
                <TableHardwareTypeComponent/>
                <ModalHardwareTypeComponent/>
            </LayoutContent>
        )
    }
}