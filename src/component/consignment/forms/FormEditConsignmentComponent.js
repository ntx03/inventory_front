import {Form, Input, Select, TreeSelect} from 'antd';
import {RenderSelectOption, RenderTreeNode} from 'component/base/RenderSelectOptionOfList';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {filterOption} from 'utils/filterOption';

@inject('consignmentViewStore')
@observer
export class FormEditConsignmentComponent extends React.Component {
    render() {
        const {consignmentViewStore} = this.props;
        return (
            <Form>
                <Form.Item label="От кого">
                    <Select value={consignmentViewStore.consignment.senderId}
                            onChange={this.handleConsignmentSenderChange}
                            showSearch
                            allowClear
                            filterOption={filterOption}>
                        {RenderSelectOption.byName(consignmentViewStore.userList)}
                    </Select>
                </Form.Item>
                <Form.Item label="Откуда">
                    <TreeSelect value={consignmentViewStore.consignment.sourceLocationId}
                                onChange={this.handleConsignmentSourceLocationChange}
                                showSearch
                                allowClear
                                treeDefaultExpandAll>
                        {RenderTreeNode(consignmentViewStore.locationListToTree)}
                    </TreeSelect>
                </Form.Item>
                <Form.Item label="Куда">
                    <TreeSelect value={consignmentViewStore.consignment.destinationLocationId}
                                onChange={this.handleConsignmentDestinationLocationChange}
                                showSearch
                                allowClear
                                treeDefaultExpandAll>
                        {RenderTreeNode(consignmentViewStore.locationListToTree)}
                    </TreeSelect>
                </Form.Item>
                <Form.Item label="Ответственное лицо">
                    <Select value={consignmentViewStore.consignment.recipientId}
                            onChange={this.handleConsignmentRecipientChange}
                            showSearch
                            allowClear
                            filterOption={filterOption}>
                        {RenderSelectOption.byName(consignmentViewStore.userList)}
                    </Select>
                </Form.Item>
                <Form.Item label="Курьер">
                    <Input value={consignmentViewStore.consignment.courier}
                           onChange={this.handleConsignmentCourierChange}/>
                </Form.Item>
            </Form>
        )
    }

    handleConsignmentSenderChange = (value) => {
        const {consignmentViewStore} = this.props;
        consignmentViewStore.setConsignmentSenderId(value);
    };

    handleConsignmentSourceLocationChange = (value) => {
        const {consignmentViewStore} = this.props;
        consignmentViewStore.setConsignmentSourceLocationId(value);
    };

    handleConsignmentDestinationLocationChange = (value) => {
        const {consignmentViewStore} = this.props;
        consignmentViewStore.setConsignmentDestinationLocationId(value);
    };

    handleConsignmentRecipientChange = (value) => {
        const {consignmentViewStore} = this.props;
        consignmentViewStore.setConsignmentRecipientId(value);
    };

    handleConsignmentCourierChange = e => {
        const {consignmentViewStore} = this.props;
        consignmentViewStore.setConsignmentCourier(e.target.value)
    };

}