import {Button, Popconfirm} from 'antd';
import {inject, observer} from 'mobx-react';
import React from 'react';

@inject('equipmentViewStore')
@observer
export class EquipmentDeleteButtonComponent extends React.Component {
    render() {
        return (
            <Popconfirm placement="left"
                        title={'Вы точно хотите удалить?'}
                        okText="Да"
                        cancelText="Нет"
                        onConfirm={this.handleClick}>
                <Button type="danger"
                        shape="circle"
                        ghost
                        icon="delete"
                        title="Удалить"/>
            </Popconfirm>
        )
    }

    handleClick = () => {
        const {equipmentViewStore, equipment} = this.props;
        equipmentViewStore.handleDeleteEquipment(equipment.id);
    }
}
