import {Icon, Switch} from 'antd'
import {inject, observer} from 'mobx-react';
import React from 'react';

@observer
export class ButtonsTableEquipmentAcceptConsignmentComponent extends React.Component {
    render() {
        const {original} = this.props;
        return (
            <div className='table__buttons'>
                <ButtonAccept equipment={original}/>
            </div>
        );
    }
}

@inject('consignmentViewStore')
@observer
class ButtonAccept extends React.Component {
    render() {
        return (
            <Switch checkedChildren={<Icon type="check"/>}
                    unCheckedChildren={<Icon type="cross"/>}
                    onChange={this.handleClick}/>
        )
    }

    handleClick = checked => {
        const {consignmentViewStore, equipment} = this.props;
        consignmentViewStore.handleAcceptedEquipment(equipment.id, checked);
    };
}