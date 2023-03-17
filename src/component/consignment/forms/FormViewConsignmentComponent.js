import {Form, Input} from 'antd';
import {ErrorComponent} from 'component/base/ErrorComponent';
import {LoadingComponent} from 'component/base/LoadingComponent';
import {TableConsumablesConsignmentComponent} from 'component/consignment/tables/TableConsumablesConsignmentComponent';
import {TableEquipmentsConsignmentComponent} from 'component/consignment/tables/TableEquipmentsConsignmentComponent';
import {inject, observer} from 'mobx-react';
import React from 'react';

@inject('equipmentViewStore')
@observer
export class FormViewConsignmentComponent extends React.Component {
    render() {
        const {equipmentViewStore} = this.props;
        if (equipmentViewStore.stateEquipmentAndConsumablesLoad.pending) {
            return <LoadingComponent/>
        }
        if (equipmentViewStore.stateEquipmentAndConsumablesLoad.errors) {
            return <ErrorComponent errors={equipmentViewStore.stateEquipmentAndConsumablesLoad.errors}/>
        }
        const existsEquipmentAndConsumables = (!equipmentViewStore.showEquipmentList && !equipmentViewStore.showConsumablesList);
        return (
            <Form>
                {equipmentViewStore.showEquipmentList &&
                <Form.Item label="Оборудование">
                    <TableEquipmentsConsignmentComponent equipmentList={equipmentViewStore.consignmentEquipmentList}
                                                         columns={equipmentViewStore.columnsEquipmentActionView}/>
                </Form.Item>}
                {equipmentViewStore.showConsumablesList &&
                <Form.Item label="Расходники">
                    <TableConsumablesConsignmentComponent consumablesList={equipmentViewStore.consumablesList}
                                                          columns={equipmentViewStore.columnsConsumablesActionView}/>
                </Form.Item>}
                {existsEquipmentAndConsumables &&
                <div style={{textAlign: 'center'}}>Пусто</div>
                }
                <Form.Item label="Комментарий">
                    <Input.TextArea value={equipmentViewStore.comment}
                                    disabled={true}/>
                </Form.Item>
                <Form.Item label="Курьер">
                    <Input.TextArea value={equipmentViewStore.consignment.courier}
                                    disabled={true}/>
                </Form.Item>
            </Form>
        )
    }
}