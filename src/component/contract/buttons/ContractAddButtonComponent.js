import {Button} from 'antd';
import {inject, observer} from 'mobx-react';
import React from 'react';

@inject('contractViewStore')
@observer
export class ContractAddButtonComponent extends React.Component {
    render() {
        return (
            <Button type="primary"
                    icon="plus"
                    onClick={this.handleClick}>
                Добавить
            </Button>
        )
    }

    handleClick = () => {
        const {contractViewStore} = this.props;
        contractViewStore.showModalAddContract();
    };
}