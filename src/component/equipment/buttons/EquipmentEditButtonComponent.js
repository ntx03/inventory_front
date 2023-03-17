import {Button} from 'antd';
import {inject, observer} from 'mobx-react';
import React from 'react';

@inject('equipmentViewStore')
@observer
export class EquipmentEditButtonComponent extends React.Component {
    render() {
        return (
            <Button type="primary"
                    shape="circle"
                    ghost
                    icon="edit"
                    title="Редактировать"
                    onClick={this.handleClick}/>
        )
    }

    handleClick = () => {
        const {equipmentViewStore, equipment} = this.props;
        equipmentViewStore.showModalEquipmentEdit(equipment)
    }
}
