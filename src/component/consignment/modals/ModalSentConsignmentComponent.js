import {Modal} from 'antd';
import {FormSentConsignmentComponent} from 'component/consignment/forms/FormSentConsignmentComponent';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {modals} from 'utils/ModalName';

@inject('consignmentViewStore')
@observer
export class ModalSentConsignmentComponent extends React.Component {
    render() {
        const {consignmentViewStore} = this.props;
        return (
            <Modal
                title='Отправленная накладная'
                visible={consignmentViewStore.modal === modals.ModalSentConsignment}
                footer={null}
                onCancel={this.handleCancelClick}
                width={1000}>
                <FormSentConsignmentComponent/>
            </Modal>
        )
    }

    handleCancelClick = () => {
        const {consignmentViewStore} = this.props;
        consignmentViewStore.hideModal();
    };
}