import {Form} from 'antd';
import {ErrorComponent} from 'component/base/ErrorComponent';
import {LoadingComponent} from 'component/base/LoadingComponent';
import {TableConsumablesConsignmentComponent} from 'component/consignment/tables/TableConsumablesConsignmentComponent';
import {TableEquipmentsConsignmentComponent} from 'component/consignment/tables/TableEquipmentsConsignmentComponent';
import {inject, observer} from 'mobx-react';
import React from 'react';

@inject('consignmentViewStore')
@observer
export class FormAcceptedConsignmentComponent extends React.Component {
    render() {
        const {consignmentViewStore} = this.props;
        if (consignmentViewStore.stateEquipmentAndConsumablesLoad.pending) {
            return <LoadingComponent/>
        }
        if (consignmentViewStore.stateEquipmentAndConsumablesLoad.errors) {
            return <ErrorComponent errors={consignmentViewStore.stateEquipmentAndConsumablesLoad.errors}/>
        }
        return (
            <Form>
                {consignmentViewStore.equipmentList.length > 0 &&
                <Form.Item label="Оборудование">
                    <TableEquipmentsConsignmentComponent equipmentList={consignmentViewStore.equipmentList}
                                                         columns={consignmentViewStore.columnsEquipmentAccepted}/>
                </Form.Item>
                }
                {consignmentViewStore.consumablesList.length > 0 &&
                <Form.Item label="Расходники">
                    <TableConsumablesConsignmentComponent consumablesList={consignmentViewStore.consumablesList}
                                                          columns={consignmentViewStore.columnsConsumablesAccepted}/>
                </Form.Item>
                }
            </Form>
        )
    }
}