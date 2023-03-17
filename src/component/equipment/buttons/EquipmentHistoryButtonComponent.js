import {Button} from 'antd';
import {inject, observer} from 'mobx-react';
import React from 'react';

@inject('equipmentViewStore')
@observer
export class EquipmentHistoryButtonComponent extends React.Component {
    render() {
        return (
            <Button type="dashed"
                    shape="circle"
                    icon="hourglass"
                    title="История"
                    onClick={this.handleClick}/>
        )
    }

    handleClick = () => {
        const {equipmentViewStore, equipment} = this.props;
        equipmentViewStore.showCardEquipmentHistory(equipment)
    }
}
