import {Button, Popconfirm} from 'antd';
import {inject, observer} from 'mobx-react';
import React from 'react';

@inject('contractViewStore')
@observer
export class ContractDeleteButtonComponent extends React.Component {
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
        const {contractViewStore, contract} = this.props;
        contractViewStore.handleDeleteContract(contract.id);
    };
}