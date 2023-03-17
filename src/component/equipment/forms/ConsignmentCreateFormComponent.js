import {Form, Input, Select, TreeSelect} from 'antd';
import {RenderSelectOption, RenderTreeNode} from 'component/base/RenderSelectOptionOfList';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {filterOption} from 'utils/filterOption';

@inject('equipmentViewStore')
@observer
export class ConsignmentCreateFormComponent extends React.Component {
    render() {
        const {equipmentViewStore} = this.props;
        return (
            <Form>
                <Form.Item label="От кого">
                    <Select value={equipmentViewStore.consignment.senderId}
                            onChange={this.handleConsignmentSenderChange}
                            showSearch
                            allowClear
                            filterOption={filterOption}>
                        {RenderSelectOption.byName(equipmentViewStore.userList)}
                    </Select>
                </Form.Item>
                <Form.Item label="Откуда">
                    <TreeSelect value={equipmentViewStore.consignment.sourceLocationId}
                                onChange={this.handleConsignmentSourceLocationChange}
                                showSearch
                                allowClear
                                treeDefaultExpandAll>
                        {RenderTreeNode(equipmentViewStore.locationListToTree)}
                    </TreeSelect>
                </Form.Item>
                <Form.Item label="Куда">
                    <TreeSelect value={equipmentViewStore.consignment.destinationLocationId}
                                onChange={this.handleConsignmentDestinationLocationChange}
                                showSearch
                                allowClear
                                treeDefaultExpandAll>
                        {RenderTreeNode(equipmentViewStore.locationListToTree)}
                    </TreeSelect>
                </Form.Item>
                <Form.Item label="Ответственное лицо">
                    <Select value={equipmentViewStore.consignment.recipientId}
                            onChange={this.handleConsignmentRecipientChange}
                            showSearch
                            allowClear
                            filterOption={filterOption}>
                        {RenderSelectOption.byName(equipmentViewStore.userList)}
                    </Select>
                </Form.Item>
                <Form.Item label="Курьер">
                    <Input value={equipmentViewStore.consignment.courier}
                           onChange={this.handleConsignmentCourierChange}/>
                </Form.Item>
            </Form>
        )
    }

    handleConsignmentSenderChange = (value) => {
        const {equipmentViewStore} = this.props;
        equipmentViewStore.setConsignmentSenderId(value);
    };

    handleConsignmentSourceLocationChange = (value) => {
        const {equipmentViewStore} = this.props;
        equipmentViewStore.setConsignmentSourceLocationId(value);
    };

    handleConsignmentDestinationLocationChange = (value) => {
        const {equipmentViewStore} = this.props;
        equipmentViewStore.setConsignmentDestinationLocationId(value);
    };

    handleConsignmentRecipientChange = (value) => {
        const {equipmentViewStore} = this.props;
        equipmentViewStore.setConsignmentRecipientId(value);
    };

    handleConsignmentCourierChange = e => {
        const {equipmentViewStore} = this.props;
        equipmentViewStore.setConsignmentCourier(e.target.value);
    };

}