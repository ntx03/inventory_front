import {Button, Form, Input} from 'antd';
import {ErrorComponent} from 'component/base/ErrorComponent';
import {LoadingComponent} from 'component/base/LoadingComponent';
import {TableConsumablesConsignmentComponent} from 'component/consignment/tables/TableConsumablesConsignmentComponent';
import {TableEquipmentsConsignmentComponent} from 'component/consignment/tables/TableEquipmentsConsignmentComponent';
import {inject, observer} from 'mobx-react';
import React from 'react';

@inject('consignmentViewStore')
@observer
export class FormSendConsignmentComponent extends React.Component {
    render() {
        const {consignmentViewStore} = this.props;
        if (consignmentViewStore.stateEquipmentAndConsumablesLoad.pending) {
            return <LoadingComponent/>
        }
        if (consignmentViewStore.stateEquipmentAndConsumablesLoad.errors) {
            return <ErrorComponent errors={consignmentViewStore.stateEquipmentAndConsumablesLoad.errors}/>
        }
        const existsEquipmentAndConsumables = (!consignmentViewStore.showEquipmentList && !consignmentViewStore.showConsumablesList);
        const hasCourier = consignmentViewStore.consignment.courier != null && consignmentViewStore.consignment.courier !== '';
        return (
            <Form>
                {consignmentViewStore.showEquipmentList &&
                <Form.Item label="Оборудование">
                    <TableEquipmentsConsignmentComponent equipmentList={consignmentViewStore.equipmentList}
                                                         columns={consignmentViewStore.columnsEquipmentActionSend}/>
                </Form.Item>
                }
                {consignmentViewStore.showConsumablesList &&
                <Form.Item label="Расходники">
                    <TableConsumablesConsignmentComponent consumablesList={consignmentViewStore.consumablesList}
                                                          columns={consignmentViewStore.columnsConsumablesActionSend}/>
                </Form.Item>
                }
                {existsEquipmentAndConsumables &&
                <div style={{textAlign: 'center'}}>Пусто</div>
                }
                <Form.Item label="Комментарий">
                    <Input.TextArea value={consignmentViewStore.comment}
                                    onChange={this.handleCommentChange}/>
                </Form.Item>
                <Form.Item label="Курьер"
                           validateStatus={(!hasCourier) ? 'error' : null}>
                    <Input value={consignmentViewStore.consignment.courier}
                           onChange={this.handleCourierChange}/>
                </Form.Item>
                <Form.Item style={{textAlign: 'right'}}>
                    <Button onClick={this.handleCancelClick}>
                        Отмена
                    </Button>
                    <Button type="primary"
                            disabled={existsEquipmentAndConsumables}
                            onClick={this.handleOkClick}>
                        Отправить
                    </Button>
                </Form.Item>
            </Form>
        )
    }

    handleOkClick = () => {
        const {consignmentViewStore} = this.props;
        consignmentViewStore.handleSendConsignment();
    };

    handleCancelClick = () => {
        const {consignmentViewStore} = this.props;
        consignmentViewStore.hideModal();
    };

    handleCommentChange = ({target}) => {
        const {consignmentViewStore} = this.props;
        consignmentViewStore.setComment(target.value)
    };

    handleCourierChange = ({target}) => {
        const {consignmentViewStore} = this.props;
        consignmentViewStore.setConsignmentCourier(target.value)
    };
}