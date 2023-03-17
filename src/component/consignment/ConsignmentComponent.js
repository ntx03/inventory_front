import {ButtonsTitleConsignmentComponent} from 'component/consignment/ButtonsTitleConsignmentComponent';
import {ModalEditConsignmentComponent} from 'component/consignment/modals/ModalEditConsignmentComponent';
import {ModalSendConsignmentComponent} from 'component/consignment/modals/ModalSendConsignmentComponent';
import {LayoutContent} from 'layout/LayoutContent';
import {inject, observer} from 'mobx-react';
import {toJS} from 'mobx';
import React from 'react';
import {ErrorComponent} from '../base/ErrorComponent';
import {LoadingComponent} from '../base/LoadingComponent';
import {TableConsignmentComponent} from './tables/TableConsignmentComponent';

@inject('consignmentViewStore')
@observer
export class ConsignmentComponent extends React.Component {
    render() {
        const {consignmentViewStore} = this.props;
        if (consignmentViewStore.stateLoad.pending) {
            return <LoadingComponent/>
        }
        if (consignmentViewStore.stateLoad.errors) {
            return <ErrorComponent errors={consignmentViewStore.stateLoad.errors}/>
        }
        return (
            <LayoutContent title='Созданные накладные'
                           buttons={<ButtonsTitleConsignmentComponent/>}>
                <TableConsignmentComponent columns={consignmentViewStore.columnCreatedConsignment}
                                           data={toJS(consignmentViewStore.consignmentCreatedList)}
                                           filtered={consignmentViewStore.filtered}/>
                <ModalEditConsignmentComponent/>
                <ModalSendConsignmentComponent/>
            </LayoutContent>
        )
    }
}