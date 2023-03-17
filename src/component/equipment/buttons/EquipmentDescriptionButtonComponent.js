import {Button} from 'antd';
import {inject, observer} from 'mobx-react';
import React from 'react';

@inject('equipmentViewStore')
@observer
export class EquipmentDescriptionButtonComponent extends React.Component {
    render() {
        return (
            <Button type="dashed"
                    shape="circle"
                    icon="profile"
                    title="Описание"
                    onClick={this.handleClick}/>
        )
    }

    handleClick = () => {
        const {equipmentViewStore, equipment} = this.props;
        equipmentViewStore.showCardEquipmentDescription(equipment)
    }
}
