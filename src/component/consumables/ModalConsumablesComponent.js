import {Modal} from 'antd'
import {FormChangeStateConsumablesComponent} from 'component/consumables/FormChangeStateConsumablesComponent';
import {FormEditConsignmentConsumablesComponent} from 'component/consumables/FormEditConsignmentConsumablesComponent';
import {FormEditConsumablesComponent} from 'component/consumables/FormEditConsumablesComponent';
import {inject, observer} from 'mobx-react/index';
import React from 'react'
import {modals} from 'utils/ModalName';

@inject('consumablesViewStore')
@observer
export class ModalEditConsumablesComponent extends React.Component {
    render() {
        const {consumablesViewStore} = this.props;
        return (
            <Modal
                title={consumablesViewStore.consumables.id && 'Редактировать' || 'Добавить'}
                visible={consumablesViewStore.modal === modals.ModalEditConsumables}
                onOk={this.handleOkClick}
                onCancel={this.handleCancelClick}
            >
                <FormEditConsumablesComponent/>
            </Modal>
        )
    }

    handleOkClick = () => {
        const {consumablesViewStore} = this.props;
        consumablesViewStore.handleSaveConsumables();
    };

    handleCancelClick = () => {
        const {consumablesViewStore} = this.props;
        consumablesViewStore.hideModal();
    };
}

@inject('consumablesViewStore')
@observer
export class ModalChangeStateConsumablesComponent extends React.Component {
    render() {
        const {consumablesViewStore} = this.props;
        return (
            <Modal
                title={'Изменить состояние'}
                visible={consumablesViewStore.modal === modals.ModalChangeStateConsumables}
                onOk={this.handleOkClick}
                onCancel={this.handleCancelClick}
            >
                <FormChangeStateConsumablesComponent/>
            </Modal>
        )
    }

    handleOkClick = () => {
        const {consumablesViewStore} = this.props;
        consumablesViewStore.handleSaveChangeStateConsumables();
    };

    handleCancelClick = () => {
        const {consumablesViewStore} = this.props;
        consumablesViewStore.hideModal();
    };
}

@inject('consumablesViewStore')
@observer
export class ModalEditConsignmentConsumablesComponent extends React.Component {
    render() {
        const {consumablesViewStore} = this.props;
        return (
            <Modal
                title={'Добавить в накладную'}
                visible={consumablesViewStore.modal === modals.ModalEditConsignmentConsumables}
                onOk={this.handleOkClick}
                onCancel={this.handleCancelClick}>
                <FormEditConsignmentConsumablesComponent/>
            </Modal>
        )
    }

    handleOkClick = () => {
        const {consumablesViewStore} = this.props;
        consumablesViewStore.handleSaveEditConsignmentConsumables();
    };

    handleCancelClick = () => {
        const {consumablesViewStore} = this.props;
        consumablesViewStore.hideModal();
    };
}