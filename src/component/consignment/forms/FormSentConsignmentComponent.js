import {Button, Form} from 'antd';
import {ErrorComponent} from 'component/base/ErrorComponent';
import {LoadingComponent} from 'component/base/LoadingComponent';
import {TableConsumablesConsignmentComponent} from 'component/consignment/tables/TableConsumablesConsignmentComponent';
import {TableEquipmentsConsignmentComponent} from 'component/consignment/tables/TableEquipmentsConsignmentComponent';
import {inject, observer} from 'mobx-react';
import React from 'react';

@inject('consignmentViewStore')
@observer
export class FormSentConsignmentComponent extends React.Component {
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
                <Form.Item style={{textAlign: 'right', marginBottom: 0}}>
                    <Button type="dashed"
                            icon="download"
                            onClick={this.handleDownloadClick}>
                        Распечатать
                    </Button>
                </Form.Item>
                {consignmentViewStore.equipmentList.length > 0 &&
                <Form.Item label="Оборудование">
                    <TableEquipmentsConsignmentComponent equipmentList={consignmentViewStore.equipmentList}
                                                         columns={consignmentViewStore.columnsEquipmentWithState}/>
                </Form.Item>
                }
                {consignmentViewStore.consumablesList.length > 0 &&
                <Form.Item label="Расходники">
                    <TableConsumablesConsignmentComponent consumablesList={consignmentViewStore.consumablesList}
                                                          columns={consignmentViewStore.columnsConsumablesWithState}/>
                </Form.Item>
                }
            </Form>
        )
    }

    handleDownloadClick = () => {
        const {consignmentViewStore} = this.props;
        consignmentViewStore.handleDownloadConsignment();
    };

}