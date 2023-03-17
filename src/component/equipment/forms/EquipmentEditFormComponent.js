import {Form, Input, InputNumber, Select, TreeSelect} from 'antd';
import {RenderSelectOption, RenderTreeNode} from 'component/base/RenderSelectOptionOfList';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {filterOption} from 'utils/filterOption';

@inject('equipmentViewStore')
@observer
export class EquipmentEditFormComponent extends React.Component {
    render() {
        const {equipmentViewStore,disabled} = this.props;
        const RenderModelList = (modelList) => {
            const {equipmentViewStore} = this.props;
            return modelList.map(item => {
                const vendor = equipmentViewStore.modelIdToVendorMap.get(item.id);
                const title = `${item.name} (${vendor && vendor.name})`;
                return <Select.Option key={item.id} title={title}>{title}</Select.Option>
            })
        };
        return (
            <Form>
                <Form.Item label="Инвентарный номер">
                    <Input value={equipmentViewStore.equipment.inventoryNumber}
                           disabled={disabled}
                           onChange={this.handleEquipmentInventoryNumberChange}/>
                </Form.Item>
                <Form.Item label="Серийный номер">
                    <Input value={equipmentViewStore.equipment.serialNumber}
                           disabled={disabled}
                           onChange={this.handleEquipmentSerialNumberChange}/>
                </Form.Item>
                <Form.Item label="Модель">
                    <Select value={equipmentViewStore.equipment.modelId}
                            disabled={disabled}
                            onChange={this.handleEquipmentModelIdChange}
                            allowClear
                            showSearch
                            filterOption={filterOption}>
                        {RenderModelList(equipmentViewStore.modelList)}
                    </Select>
                </Form.Item>
                <Form.Item label="Описание">
                    <Input.TextArea value={equipmentViewStore.equipment.description}
                                    disabled={disabled}
                                    onChange={this.handleEquipmentDescriptionChange}/>
                </Form.Item>
                <Form.Item label="Местоположение">
                    <TreeSelect value={equipmentViewStore.equipment.locationId}
                                onChange={this.handleEquipmentLocationChange}
                                disabled={disabled}
                                showSearch
                                allowClear
                                treeDefaultExpandAll>
                        {RenderTreeNode(equipmentViewStore.locationListToTree)}
                    </TreeSelect>
                </Form.Item>
                <Form.Item label="Состояние">
                    <Select value={equipmentViewStore.equipment.stateId}
                            disabled={disabled}
                            onChange={this.handleEquipmentStateChange}
                            showSearch
                            allowClear
                            filterOption={filterOption}>
                        {RenderSelectOption.byName(equipmentViewStore.stateList)}
                    </Select>
                </Form.Item>
                <Form.Item label="Номер договора">
                    <Select value={equipmentViewStore.equipment.contractId}
                            disabled={disabled}
                            onChange={this.handleEquipmentContractChange}
                            allowClear
                            showSearch
                            filterOption={filterOption}>
                        {RenderSelectOption.byNumber(equipmentViewStore.contractList)}
                    </Select>
                </Form.Item>
                <Form.Item label="Цена">
                    <InputNumber min={0}
                                 disabled={disabled}
                                 value={equipmentViewStore.equipment.price}
                                 onChange={this.handleEquipmentPriceChange}/>
                </Form.Item>
            </Form>
        )
    }

    handleEquipmentInventoryNumberChange = e => {
        const {equipmentViewStore} = this.props;
        equipmentViewStore.setEquipmentInventoryNumber(e.target.value)
    };

    handleEquipmentModelIdChange = value => {
        const {equipmentViewStore} = this.props;
        equipmentViewStore.setEquipmentModelId(value);
    };

    handleEquipmentSerialNumberChange = e => {
        const {equipmentViewStore} = this.props;
        equipmentViewStore.setEquipmentSerialNumber(e.target.value)
    };

    handleEquipmentDescriptionChange = e => {
        const {equipmentViewStore} = this.props;
        equipmentViewStore.setEquipmentDescription(e.target.value)
    };

    handleEquipmentLocationChange = value => {
        const {equipmentViewStore} = this.props;
        equipmentViewStore.setEquipmentLocationId(value);
    };

    handleEquipmentStateChange = value => {
        const {equipmentViewStore} = this.props;
        equipmentViewStore.setEquipmentStateId(value);
    };

    handleEquipmentContractChange = value => {
        const {equipmentViewStore} = this.props;
        equipmentViewStore.setEquipmentContractId(value);
    };

    handleEquipmentPriceChange = value => {
        const {equipmentViewStore} = this.props;
        equipmentViewStore.setEquipmentPrice(value)
    };

}