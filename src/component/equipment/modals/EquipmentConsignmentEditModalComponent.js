import {Form, Modal, Select} from 'antd';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {filterOption} from "utils/filterOption";

@inject('equipmentViewStore')
@observer
export class EquipmentConsignmentEditModalComponent extends React.Component {
    render() {
        const {equipmentViewStore} = this.props;
        const RenderSelectOption = () => {
            const locationIdToLocationMap = equipmentViewStore.locationIdToLocationMap;

            return equipmentViewStore.consignmentCreatedList.map(item => {
                const sourceLocation = this.getFullNameLocation(locationIdToLocationMap.get(item.sourceLocationId), []);
                const destinationLocation = this.getFullNameLocation(locationIdToLocationMap.get(item.destinationLocationId), []);

                const sender = item.sender.name;
                const recipient = item.recipient.name;

                const title = `${item.number} ${sender} ${sourceLocation} -> ${recipient} ${destinationLocation}`;
                return <Select.Option key={item.id} title={title}>{title}</Select.Option>
            })
        };
        return (
            <Modal
                title={'Добавление в накладную'}
                visible={equipmentViewStore.modal === 'EDIT_CONSIGNMENT'}
                onOk={this.handleOkClick}
                okType={equipmentViewStore.consignmentId ? 'primary' : 'dashed'}
                onCancel={this.handleCancelClick}
                mask={false}>
                <Form>
                    <Form.Item label="Накладная">
                        <Select value={equipmentViewStore.consignmentId}
                                onChange={this.handleEquipmentStateChange}
                                filterOption={filterOption}
                                showSearch
                                allowClear>
                            {RenderSelectOption()}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        )
    }

    handleEquipmentStateChange = value => {
        const {equipmentViewStore} = this.props;
        equipmentViewStore.setConsignmentId(value);
    };

    handleOkClick = () => {
        const {equipmentViewStore} = this.props;
        if (equipmentViewStore.consignmentId) {
            equipmentViewStore.handleEditEquipmentConsignmentId()
        }
    };

    handleCancelClick = () => {
        const {equipmentViewStore} = this.props;
        equipmentViewStore.hideModal();
        equipmentViewStore.setConsignmentId(null);
    };

    getFullNameLocation = (location, fullLocationList) => {
        const {equipmentViewStore} = this.props;

        if (location == null) {
            return fullLocationList.join(" / ");
        }
        fullLocationList.push(location.name);

        const parent = equipmentViewStore.locationIdToLocationMap.get(location.parentId);
        return this.getFullNameLocation(parent, fullLocationList)
    }
}