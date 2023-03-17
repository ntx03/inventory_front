import {ModalAcceptConsignmentComponent} from 'component/consignment/modals/ModalAcceptConsignmentComponent';
import {ModalSentConsignmentComponent} from 'component/consignment/modals/ModalSentConsignmentComponent';
import {TableConsignmentComponent} from 'component/consignment/tables/TableConsignmentComponent';
import {LayoutContent} from 'layout/LayoutContent';
import {toJS} from 'mobx';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {ErrorComponent} from '../base/ErrorComponent';
import {LoadingComponent} from '../base/LoadingComponent';

@inject('consignmentViewStore')
@observer
export class ConsignmentSentComponent extends React.Component {
    render() {
        const {consignmentViewStore} = this.props;
        if (consignmentViewStore.stateLoad.pending) {
            return <LoadingComponent/>
        }
        if (consignmentViewStore.stateLoad.errors) {
            return <ErrorComponent errors={consignmentViewStore.stateLoad.errors}/>
        }
        return (
            <LayoutContent title='Отправленные накладные'>
                <TableConsignmentComponent columns={consignmentViewStore.columnSentConsignment}
                                           data={toJS(consignmentViewStore.consignmentSentList)}
                                           filtered={consignmentViewStore.filtered}/>
                <ModalSentConsignmentComponent/>
                <ModalAcceptConsignmentComponent/>
            </LayoutContent>
        )
    }
}