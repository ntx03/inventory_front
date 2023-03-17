import {Button} from 'antd';
import {inject, observer} from 'mobx-react';
import React from 'react';

@inject('equipmentViewStore')
@observer
export class EquipmentEditConsignmentButtonComponent extends React.Component {
    render() {
        return (
            <Button icon="file-add"
                    onClick={this.handleClick}>
                Добавить в накладную
            </Button>
        )
    }

    handleClick = () => {
        const {equipmentViewStore} = this.props;
        equipmentViewStore.showModalEquipmentEditConsignment()
    };
}
