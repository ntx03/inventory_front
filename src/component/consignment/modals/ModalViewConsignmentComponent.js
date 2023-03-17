import {Modal} from 'antd';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {modals} from 'utils/ModalName';
import {FormViewConsignmentComponent} from "../forms/FormViewConsignmentComponent";
import moment from 'moment';

@inject('equipmentViewStore')
@observer
export class ModalViewConsignmentComponent extends React.Component {
    render() {
        const {equipmentViewStore} = this.props;
        return (
            <Modal
                title={`Накладная № ${equipmentViewStore.consignment.number} от ${moment(equipmentViewStore.consignment.timestamp).format('DD.MM.YYYY LTS')}`}
                visible={equipmentViewStore.modal === modals.ModalViewConsignment}
                footer={null}
                onCancel={this.handleCancelClick}
                width={1000}>
                <FormViewConsignmentComponent/>
            </Modal>
        )
    }

    handleCancelClick = () => {
        const {equipmentViewStore} = this.props;
        equipmentViewStore.hideModal();
    };
}