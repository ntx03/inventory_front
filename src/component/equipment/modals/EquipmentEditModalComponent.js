import {Modal} from 'antd';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {EquipmentEditFormComponent} from "component/equipment/forms/EquipmentEditFormComponent";

@inject('equipmentViewStore')
@observer
export class EquipmentEditModalComponent extends React.Component {
    render() {
        const {equipmentViewStore} = this.props;
        const equipment = equipmentViewStore.equipment;
        return (
            <Modal
                title={equipment.id && 'Редактировать' || 'Добавить'}
                visible={equipmentViewStore.modal === 'EDIT_EQUIPMENT'}
                onOk={() => equipmentViewStore.handleSaveEquipment()}
                onCancel={() => equipmentViewStore.hideModal()}>
                <EquipmentEditFormComponent/>
            </Modal>
        )
    }
}