import {ModalAcceptedConsignmentComponent} from 'component/consignment/modals/ModalAcceptedConsignmentComponent';
import {TableConsignmentComponent} from 'component/consignment/tables/TableConsignmentComponent';
import {LayoutContent} from 'layout/LayoutContent';
import {toJS} from 'mobx';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {ErrorComponent} from '../base/ErrorComponent';
import {LoadingComponent} from '../base/LoadingComponent';

@inject('consignmentViewStore')
@observer
export class ConsignmentAcceptedComponent extends React.Component {
    render() {
        const {consignmentViewStore} = this.props;
        if (consignmentViewStore.stateLoad.pending) {
            return <LoadingComponent/>
        }
        if (consignmentViewStore.stateLoad.errors) {
            return <ErrorComponent errors={consignmentViewStore.stateLoad.errors}/>
        }
        return (
            <LayoutContent title='Принятые накладные'>
                <TableConsignmentComponent columns={consignmentViewStore.columnAcceptedConsignment}
                                           data={toJS(consignmentViewStore.consignmentAcceptedList)}
                                           filtered={consignmentViewStore.filtered}/>
                <ModalAcceptedConsignmentComponent/>
            </LayoutContent>
        )
    }
}