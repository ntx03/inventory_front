import {Modal} from 'antd';
import {FormAcceptedConsignmentComponent} from 'component/consignment/forms/FormAcceptedConsignmentComponent';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {modals} from 'utils/ModalName';

@inject('consignmentViewStore')
@observer
export class ModalAcceptedConsignmentComponent extends React.Component {
    render() {
        const {consignmentViewStore} = this.props;
        return (
            <Modal
                title='Принятая накладная'
                visible={consignmentViewStore.modal === modals.ModalAcceptedConsignment}
                footer={null}
                onCancel={this.handleCancelClick}
                width={1000}>
                <FormAcceptedConsignmentComponent/>
            </Modal>
        )
    }

    handleCancelClick = () => {
        const {consignmentViewStore} = this.props;
        consignmentViewStore.hideModal();
    };
}