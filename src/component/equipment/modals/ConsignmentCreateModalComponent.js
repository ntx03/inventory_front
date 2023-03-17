import {Modal} from 'antd';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {ConsignmentCreateFormComponent} from "component/equipment/forms/ConsignmentCreateFormComponent";

@inject('equipmentViewStore')
@observer
export class ConsignmentCreateModalComponent extends React.Component {
    render() {
        const {equipmentViewStore} = this.props;
        return (
            <Modal
                title={'Создать накладную'}
                visible={equipmentViewStore.modal === 'CREATE_CONSIGNMENT'}
                onOk={this.handleOkClick}
                onCancel={this.handleCancelClick}>
                <ConsignmentCreateFormComponent/>
            </Modal>
        )
    }

    handleOkClick = () => {
        const {equipmentViewStore} = this.props;
        equipmentViewStore.handleCreateConsignment();
    };

    handleCancelClick = () => {
        const {equipmentViewStore} = this.props;
        equipmentViewStore.hideModal();
    };
}