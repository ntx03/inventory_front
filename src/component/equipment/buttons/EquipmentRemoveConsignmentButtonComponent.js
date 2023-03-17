import {Button, Popconfirm} from 'antd';
import {inject, observer} from 'mobx-react';
import React from 'react';

@inject('equipmentViewStore')
@observer
export class EquipmentRemoveConsignmentButtonComponent extends React.Component {
    render() {
        return (
            <Popconfirm placement="left"
                        title={'Вы точно хотите удалить из накладной?'}
                        okText="Да"
                        cancelText="Нет"
                        onConfirm={this.handleClick}>
                <Button shape="circle"
                        icon='file-excel'
                        ghost
                        type='danger'
                        title="Удалить из накладной"/>
            </Popconfirm>
        )
    }

    handleClick = () => {
        const {equipmentViewStore, equipment} = this.props;
        equipmentViewStore.handleRemoveEquipmentConsignment(equipment.id);
    };
}
