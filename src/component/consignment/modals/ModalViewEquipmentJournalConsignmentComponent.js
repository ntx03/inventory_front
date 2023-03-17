import {Modal} from 'antd';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {modals} from 'utils/ModalName';
import moment from 'moment';
import {FormViewEquipmentJournalConsignmentComponent} from "../forms/FormViewEquipmentJournalConsignmentComponent";

@inject('equipmentJournalViewStore')
@observer
export class ModalViewEquipmentJournalConsignmentComponent extends React.Component {
    render() {
        const {equipmentJournalViewStore} = this.props;
        return (
            <Modal
                title={`Накладная № ${equipmentJournalViewStore.consignment.number} от ${moment(equipmentJournalViewStore.consignment.timestamp).format('DD.MM.YYYY LTS')}`}
                visible={equipmentJournalViewStore.modal === modals.ModalViewConsignment}
                footer={null}
                onCancel={this.handleCancelClick}
                width={1000}>
                <FormViewEquipmentJournalConsignmentComponent/>
            </Modal>
        )
    }

    handleCancelClick = () => {
        const {equipmentJournalViewStore} = this.props;
        equipmentJournalViewStore.hideModal();
    };
}