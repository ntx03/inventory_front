import {Button, Input, InputNumber} from 'antd'
import {inject, observer} from 'mobx-react';
import React from 'react';

@observer
export class ButtonsTableConsumablesAcceptedComponent extends React.Component {
    render() {
        const {original} = this.props;
        return (
            <ButtonAccept consumables={original}/>
        );
    }
}

@inject('consignmentViewStore')
@observer
class ButtonAccept extends React.Component {
    state = {
        count: 0
    };

    render() {
        const {consignmentViewStore, consumables} = this.props;
        const acceptedConsumables = consignmentViewStore.acceptedEquipments.get(consumables.id);
        return (
            <Input.Group compact>
                <Button icon={acceptedConsumables ? 'close' : 'check'}
                        type='dashed'
                        onClick={this.handleAllAcceptedClick}/>
                <InputNumber style={{width: '60%'}}
                             value={acceptedConsumables && acceptedConsumables.count}
                             max={consumables.count}
                             min={0}
                             onChange={this.handleCountChange}/>
            </Input.Group>
        )
    }

    handleCountChange = value => {
        const {consignmentViewStore, consumables} = this.props;
        consignmentViewStore.handleAcceptedConsumables(consumables.id, value);
    };

    handleAllAcceptedClick = () => {
        const {consignmentViewStore, consumables} = this.props;
        const acceptedConsumables = consignmentViewStore.acceptedEquipments.get(consumables.id);
        consignmentViewStore.handleAcceptedConsumables(consumables.id,
            acceptedConsumables ? 0 : consumables.count);
    }
}