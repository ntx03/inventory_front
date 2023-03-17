import {Checkbox, Form, Input, Modal, Select} from 'antd'
import {RenderSelectOption} from 'component/base/RenderSelectOptionOfList';
import {inject, observer} from 'mobx-react/index';
import React from 'react'
import {filterOption} from 'utils/filterOption';

@inject('modelViewStore')
@observer
export class ModalModelComponent extends React.Component {
    render() {
        const {modelViewStore} = this.props;
        const model = modelViewStore.model;
        const vendorList = modelViewStore.vendorList;
        const hardwareTypeList = modelViewStore.hardwareTypeList;
        return (
            <Modal
                title={model.id && 'Редактировать' || 'Добавить'}
                visible={modelViewStore.modal === 'EDIT'}
                onOk={() => modelViewStore.handleSaveModel()}
                onCancel={() => modelViewStore.hideModal()}>
                <Form>
                    <Form.Item label="Производитель">
                        <Select showSearch
                                value={model.vendorId}
                                onChange={this.handleModelVendorIdChange}
                                filterOption={filterOption}>
                            {RenderSelectOption.byName(vendorList)}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Модель">
                        <Input value={model.name}
                               onChange={this.handleModelNameChange}/>
                    </Form.Item>
                    <Form.Item label="Тип">
                        <Select showSearch
                                value={model.hardwareTypeId}
                                onChange={this.handleModelHardwareTypeIdChange}
                                filterOption={filterOption}>
                            {RenderSelectOption.byName(hardwareTypeList)}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Checkbox checked={model.consumable}
                                  onChange={this.handleModelConsumableChange}>
                            Расходник
                        </Checkbox>
                    </Form.Item>
                </Form>
            </Modal>
        )
    }

    handleModelVendorIdChange = vendorId => {
        const {modelViewStore} = this.props;
        modelViewStore.setModelVendorId(vendorId)
    };

    handleModelNameChange = e => {
        const {modelViewStore} = this.props;
        modelViewStore.setModelName(e.target.value)
    };

    handleModelHardwareTypeIdChange = hardwareTypeId => {
        const {modelViewStore} = this.props;
        modelViewStore.setModelHardwareTypeId(hardwareTypeId)
    };

    handleModelConsumableChange = e => {
        const {modelViewStore} = this.props;
        modelViewStore.setModelConsumable(e.target.checked)
    };
}