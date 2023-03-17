import {Button} from 'antd';
import {inject, observer} from 'mobx-react';
import React from 'react';

@inject('contractViewStore')
@observer
export class ContractEditButtonComponent extends React.Component {
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
        const {contractViewStore, contract} = this.props;
        contractViewStore.showModalEditContract(contract);
    };
}