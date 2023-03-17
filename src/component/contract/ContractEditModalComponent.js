import {Modal} from 'antd'
import {ContractEditingFormComponent} from 'component/contract/ContractEditingFormComponent';
import {inject, observer} from 'mobx-react/index';
import React from 'react'
import {modals} from 'utils/ModalName';

@inject('contractViewStore')
@observer
export class ContractEditingModalComponent extends React.Component {
    render() {
        const {contractViewStore} = this.props;
        return (
            <Modal
                title={contractViewStore.contract.id && 'Редактировать' || 'Добавить'}
                visible={contractViewStore.modal === modals.ContractEditModal}
                onOk={this.handleOkClick}
                onCancel={this.handleCancelClick}>
                <ContractEditingFormComponent/>
            </Modal>
        )
    }

    handleOkClick = () => {
        const {contractViewStore} = this.props;
        contractViewStore.handleSaveContract()
    };

    handleCancelClick = () => {
        const {contractViewStore} = this.props;
        contractViewStore.hideModal()
    };
}