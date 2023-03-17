import {Button} from 'antd';
import {inject, observer} from 'mobx-react';
import React from 'react';

@inject('equipmentViewStore')
@observer
export class EquipmentsChangeStateButtonComponent extends React.Component {
    render() {
        return (
            <Button icon='tool'  onClick={this.handleChangeStateEquipmentClick}>
                Изменить состояние
            </Button>
        )
    }

    handleChangeStateEquipmentClick = () => {
        const {equipmentViewStore} = this.props;
        equipmentViewStore.showModalEquipmentChangeState();
    };
}
