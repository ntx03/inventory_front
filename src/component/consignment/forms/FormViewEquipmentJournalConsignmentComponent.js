import {Form, Input} from 'antd';
import {ErrorComponent} from 'component/base/ErrorComponent';
import {LoadingComponent} from 'component/base/LoadingComponent';
import {TableConsumablesConsignmentComponent} from 'component/consignment/tables/TableConsumablesConsignmentComponent';
import {TableEquipmentsConsignmentComponent} from 'component/consignment/tables/TableEquipmentsConsignmentComponent';
import {inject, observer} from 'mobx-react';
import React from 'react';

@inject('equipmentJournalViewStore')
@observer
export class FormViewEquipmentJournalConsignmentComponent extends React.Component {
    render() {
        const {equipmentJournalViewStore} = this.props;
        if (equipmentJournalViewStore.stateEquipmentAndConsumablesLoad.pending) {
            return <LoadingComponent/>
        }
        if (equipmentJournalViewStore.stateEquipmentAndConsumablesLoad.errors) {
            return <ErrorComponent errors={equipmentJournalViewStore.stateEquipmentAndConsumablesLoad.errors}/>
        }
        const existsEquipmentAndConsumables = (!equipmentJournalViewStore.showEquipmentList && !equipmentJournalViewStore.showConsumablesList);
        return (
            <Form>
                {equipmentJournalViewStore.showEquipmentList &&
                <Form.Item label="Оборудование">
                    <TableEquipmentsConsignmentComponent equipmentList={equipmentJournalViewStore.consignmentEquipmentList}
                                                         columns={equipmentJournalViewStore.columnsEquipmentActionView}/>
                </Form.Item>}
                {equipmentJournalViewStore.showConsumablesList &&
                <Form.Item label="Расходники">
                    <TableConsumablesConsignmentComponent consumablesList={equipmentJournalViewStore.consignmentConsumablesList}
                                                          columns={equipmentJournalViewStore.columnsConsumablesActionView}/>
                </Form.Item>}
                {existsEquipmentAndConsumables &&
                <div style={{textAlign: 'center'}}>Пусто</div>
                }
                <Form.Item label="Комментарий">
                    <Input.TextArea value={equipmentJournalViewStore.consignment.comment}
                                    disabled={true}/>
                </Form.Item>
                <Form.Item label="Курьер">
                    <Input.TextArea value={equipmentJournalViewStore.consignment.courier}
                                    disabled={true}/>
                </Form.Item>
            </Form>
        )
    }
}