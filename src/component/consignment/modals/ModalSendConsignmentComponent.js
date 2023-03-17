import {Modal} from 'antd';
import {FormSendConsignmentComponent} from 'component/consignment/forms/FormSendConsignmentComponent';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {modals} from 'utils/ModalName';

@inject('consignmentViewStore')
@observer
export class ModalSendConsignmentComponent extends React.Component {
    render() {
        const {consignmentViewStore} = this.props;
        return (
            <Modal
                title='Отправка накладной'
                visible={consignmentViewStore.modal === modals.ModalSendConsignment}
                footer={null}
                onCancel={this.handleCancelClick}
                width={1000}>
                <FormSendConsignmentComponent/>
            </Modal>
        )
    }

    handleCancelClick = () => {
        const {consignmentViewStore} = this.props;
        consignmentViewStore.hideModal();
    };
}