import {Button, Form, Input, Popconfirm} from 'antd';
import {ErrorComponent} from 'component/base/ErrorComponent';
import {LoadingComponent} from 'component/base/LoadingComponent';
import {TableConsumablesConsignmentComponent} from 'component/consignment/tables/TableConsumablesConsignmentComponent';
import {TableEquipmentsConsignmentComponent} from 'component/consignment/tables/TableEquipmentsConsignmentComponent';
import {inject, observer} from 'mobx-react';
import React from 'react';

@inject('consignmentViewStore')
@observer
export class FormAcceptConsignmentComponent extends React.Component {
    render() {
        const {consignmentViewStore} = this.props;
        if (consignmentViewStore.stateEquipmentAndConsumablesLoad.pending) {
            return <LoadingComponent/>
        }
        if (consignmentViewStore.stateEquipmentAndConsumablesLoad.errors) {
            return <ErrorComponent errors={consignmentViewStore.stateEquipmentAndConsumablesLoad.errors}/>
        }
        const hasAccepted = consignmentViewStore.acceptedEquipments.size > 0;
        const hasRejected = consignmentViewStore.acceptedEquipments.size < consignmentViewStore.equipmentList.length;
        const hasComment = consignmentViewStore.comment != null && consignmentViewStore.comment !== '';
        return (
            <Form>
                <Form.Item style={{textAlign: 'right', marginBottom: 0}}>
                    <Button type="primary"
                            icon="check"
                            disabled={!hasAccepted || (hasRejected && !hasComment)}
                            onClick={this.handleAcceptClick}>
                        Принять
                    </Button>
                    <Button type="dashed"
                            icon="download"
                            onClick={this.handleDownloadClick}>
                        Распечатать
                    </Button>
                    <Popconfirm placement="left"
                                title={'Вы точно хотите отменить накладную?'}
                                okText="Да"
                                cancelText="Нет"
                                onConfirm={this.handleNotAcceptClick}>
                        <Button type="danger"
                                icon="close"
                                disabled={!hasComment}>
                            Отменить
                        </Button>
                    </Popconfirm>
                </Form.Item>
                {consignmentViewStore.equipmentList.length > 0 &&
                <Form.Item label="Оборудование">
                    <TableEquipmentsConsignmentComponent equipmentList={consignmentViewStore.equipmentList}
                                                         columns={consignmentViewStore.columnsEquipmentActionAccepted}/>
                </Form.Item>
                }
                {consignmentViewStore.consumablesList.length > 0 &&
                <Form.Item label="Расходники">
                    <TableConsumablesConsignmentComponent consumablesList={consignmentViewStore.consumablesList}
                                                          columns={consignmentViewStore.columnsConsumablesActionAccepted}/>
                </Form.Item>
                }
                <Form.Item label="Комментарий"
                           validateStatus={(hasRejected && !hasComment) ? 'error': null}>
                    <Input.TextArea value={consignmentViewStore.comment}
                                    onChange={this.handleCommentChange}/>
                </Form.Item>
                <Form.Item style={{textAlign: 'right'}}>
                    <Button onClick={this.handleCancelClick}>
                        Отмена
                    </Button>
                </Form.Item>
            </Form>
        )
    }

    handleAcceptClick = () => {
        const {consignmentViewStore} = this.props;
        consignmentViewStore.handleAcceptConsignment();
    };

    handleNotAcceptClick = () => {
        const {consignmentViewStore} = this.props;
        consignmentViewStore.handleNotAcceptConsignment();
    };

    handleDownloadClick = () => {
        const {consignmentViewStore} = this.props;
        consignmentViewStore.handleDownloadConsignment();
    };

    handleCommentChange = ({target}) => {
        const {consignmentViewStore} = this.props;
        consignmentViewStore.setComment(target.value)
    };

    handleCancelClick = () => {
        const {consignmentViewStore} = this.props;
        consignmentViewStore.hideModal();
    };
}

