import {Button} from 'antd';
import {inject, observer} from 'mobx-react';
import React from 'react';

@inject('equipmentViewStore')
@observer
export class ConsignmentCreateButtonComponent extends React.Component {
    render() {
        return (
            <Button type="primary"
                    icon="plus"
                    onClick={this.handleClick}>
                Создать накладную
            </Button>
        )
    }

    handleClick = () => {
        const {equipmentViewStore} = this.props;
        equipmentViewStore.showModalConsignmentCreate();
    };
}
