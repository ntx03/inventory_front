import {Row} from 'antd'
import {ErrorComponent} from 'component/base/ErrorComponent';
import {LoadingComponent} from 'component/base/LoadingComponent';
import {LayoutContent} from 'layout/LayoutContent';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {TableEquipmentJournalComponent} from "component/equipment/TableEquipmentJournalComponent";
import {FormTitlePeriodEquipmentJournalComponent} from "component/equipment/FormTitlePeriodEquipmentJournalComponent";
import {ModalViewEquipmentJournalConsignmentComponent} from "component/consignment/modals/ModalViewEquipmentJournalConsignmentComponent";

@inject('equipmentJournalViewStore')
@observer
export class EquipmentJournalComponent extends React.Component {
    render() {
        const {equipmentJournalViewStore} = this.props;
        if (equipmentJournalViewStore.stateLoad.pending) {
            return <LoadingComponent/>
        }
        if (equipmentJournalViewStore.stateLoad.errors) {
            return <ErrorComponent errors={equipmentJournalViewStore.stateLoad.errors}/>
        }
        return (
            <LayoutContent title='Журнал всех действий с оборудованием'
                           buttons={<FormTitlePeriodEquipmentJournalComponent/>}>
                <Row className='equipment'>
                    <TableEquipmentJournalComponent/>
                    <ModalViewEquipmentJournalConsignmentComponent/>
                </Row>
            </LayoutContent>
        )
    }
}