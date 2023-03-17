import {Modal} from 'antd';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {EquipmentChangeStateFormComponent} from "component/equipment/forms/EquipmentChangeStateFormComponent";

@inject('equipmentViewStore')
@observer
export class EquipmentChangeStateModalComponent extends React.Component {
    render() {
        const {equipmentViewStore} = this.props;
        return (
            <Modal
                title={'Изменить состояние'}
                visible={equipmentViewStore.modal === 'CHANGE_STATE_EQUIPMENT'}
                onOk={this.handleOkClick}
                okType={equipmentViewStore.changeState.stateId ? 'primary' : 'dashed'}
                onCancel={this.handleCancelClick}
                mask={false}>
                <EquipmentChangeStateFormComponent/>
            </Modal>
        )
    }

    handleOkClick = () => {
        const {equipmentViewStore} = this.props;
        equipmentViewStore.handleChangeStateEquipment()
    };

    handleCancelClick = () => {
        const {equipmentViewStore} = this.props;
        equipmentViewStore.hideModal();
    };

}