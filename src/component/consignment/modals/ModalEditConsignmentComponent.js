import {Modal} from 'antd';
import {FormEditConsignmentComponent} from 'component/consignment/forms/FormEditConsignmentComponent';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {modals} from 'utils/ModalName';

@inject('consignmentViewStore')
@observer
export class ModalEditConsignmentComponent extends React.Component {
    render() {
        const {consignmentViewStore} = this.props;
        return (
            <Modal
                title={consignmentViewStore.consignment.id && 'Редактировать' || 'Добавить'}
                visible={consignmentViewStore.modal === modals.ModalEditConsignment}
                onOk={this.handleOkClick}
                onCancel={this.handleCancelClick}>
                <FormEditConsignmentComponent/>
            </Modal>
        )
    }

    handleOkClick = () => {
        const {consignmentViewStore} = this.props;
        consignmentViewStore.handleSaveConsignment();
    };

    handleCancelClick = () => {
        const {consignmentViewStore} = this.props;
        consignmentViewStore.hideModal();
    };
}