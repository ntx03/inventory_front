import {Button} from 'antd';
import {inject, observer} from 'mobx-react';
import React from 'react';

@inject('equipmentViewStore')
@observer
export class EquipmentAddButtonComponent extends React.Component {
    render() {
        return (
            <Button type="primary"
                    icon="plus"
                    onClick={this.handleClick}>
                Добавить оборудование
            </Button>
        )
    }

    handleClick = () => {
        const {equipmentViewStore} = this.props;
        equipmentViewStore.showModalEquipmentAdd();
    };
}
