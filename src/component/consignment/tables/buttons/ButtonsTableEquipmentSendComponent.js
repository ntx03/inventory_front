import {Button, Popconfirm} from 'antd'
import {inject, observer} from 'mobx-react';
import React from 'react';

@observer
export class ButtonsTableEquipmentSendComponent extends React.Component {
    render() {
        const {original} = this.props;
        return (
            <div className='table__buttons'>
                <ButtonDelete equipment={original}/>
            </div>
        );
    }
}

@inject('consignmentViewStore')
@observer
class ButtonDelete extends React.Component {
    render() {
        return (
            <Popconfirm placement="left"
                        title={'Вы точно хотите убрать из накладной?'}
                        okText="Да"
                        cancelText="Нет"
                        onConfirm={this.handleClick}>
                <Button type="danger"
                        shape="circle"
                        ghost
                        icon="minus-circle"
                        style={{borderWidth: 0}}/>
            </Popconfirm>
        )
    }

    handleClick = () => {
        const {consignmentViewStore, equipment} = this.props;
        consignmentViewStore.handleRemoveEquipment(equipment.id);
    };
}