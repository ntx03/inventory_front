import {Form, Input, InputNumber, Select, TreeSelect} from 'antd'
import {RenderSelectOption, RenderTreeNode} from 'component/base/RenderSelectOptionOfList';
import {inject, observer} from 'mobx-react/index';
import React from 'react'
import {filterOption} from 'utils/filterOption';

@inject('consumablesViewStore')
@observer
export class FormEditConsumablesComponent extends React.Component {
    render() {
        const {consumablesViewStore} = this.props;
        const RenderModelList = (modelList) => {
            const modelIdToVendorMap = consumablesViewStore.modelIdToVendorMap;
            const modelIdToHardwareTypeMap = consumablesViewStore.modelIdToHardwareTypeMap;
            return modelList.map(item => {
                const vendor = modelIdToVendorMap.get(item.id);
                const hardwareType = modelIdToHardwareTypeMap.get(item.id);
                const title = `${item.name} (${vendor && vendor.name}, ${hardwareType && hardwareType.name})`;
                return <Select.Option key={item.id} title={title}>{title}</Select.Option>
            })
        };
        return (
            <Form>
                <Form.Item label="Модель">
                    <Select value={consumablesViewStore.consumables.modelId}
                            onChange={this.handleConsumablesModelIdChange}
                            filterOption={filterOption}
                            allowClear
                            showSearch>
                        {RenderModelList(consumablesViewStore.modelList)}
                    </Select>
                </Form.Item>
                <Form.Item label="Описание">
                    <Input.TextArea value={consumablesViewStore.consumables.description}
                                    onChange={this.handleConsumablesDescriptionChange}/>
                </Form.Item>
                <Form.Item label="Местоположение">
                    {/*TODO: Фильтр дерева местоположений*/}
                    <TreeSelect value={consumablesViewStore.consumables.locationId}
                                onChange={this.handleConsumablesLocationChange}
                                showSearch
                                allowClear
                                treeDefaultExpandAll>
                        {RenderTreeNode(consumablesViewStore.locationListToTree)}
                    </TreeSelect>
                </Form.Item>
                <Form.Item label="Состояние">
                    <Select value={consumablesViewStore.consumables.stateId}
                            onChange={this.handleConsumablesStateChange}
                            filterOption={filterOption}
                            showSearch
                            allowClear>
                        {RenderSelectOption.byName(consumablesViewStore.stateList)}
                    </Select>
                </Form.Item>
                <Form.Item label="Кол-во">
                    <InputNumber value={consumablesViewStore.consumables.count}
                                 onChange={this.handleConsumablesCountChange}
                                 min={0}/>
                </Form.Item>
            </Form>
        )
    }

    handleConsumablesModelIdChange = value => {
        const {consumablesViewStore} = this.props;
        consumablesViewStore.setConsumablesModelId(value)
    };

    handleConsumablesDescriptionChange = e => {
        const {consumablesViewStore} = this.props;
        consumablesViewStore.setConsumableDescription(e.target.value)
    };

    handleConsumablesLocationChange = value => {
        const {consumablesViewStore} = this.props;
        consumablesViewStore.setConsumablesLocationId(value);
    };

    handleConsumablesStateChange = value => {
        const {consumablesViewStore} = this.props;
        consumablesViewStore.setConsumablesStateId(value);
    };

    handleConsumablesCountChange = value => {
        const {consumablesViewStore} = this.props;
        consumablesViewStore.setConsumablesCount(value)
    };

}