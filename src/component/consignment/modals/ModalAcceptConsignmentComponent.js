import {Modal} from 'antd';
import {FormAcceptConsignmentComponent} from 'component/consignment/forms/FormAcceptConsignmentComponent';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {modals} from 'utils/ModalName';

@inject('consignmentViewStore')
@observer
export class ModalAcceptConsignmentComponent extends React.Component {
    render() {
        const {consignmentViewStore} = this.props;
        return (
            <Modal
                title='Принятие накладной'
                visible={consignmentViewStore.modal === modals.ModalAcceptConsignment}
                footer={null}
                onCancel={this.handleCancelClick}
                width={1000}>
                <FormAcceptConsignmentComponent/>
            </Modal>
        )
    }

    handleCancelClick = () => {
        const {consignmentViewStore} = this.props;
        consignmentViewStore.hideModal();
    };
}