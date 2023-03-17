import {Button, Popconfirm} from 'antd'
import {inject, observer} from 'mobx-react';
import React from 'react';

@inject('providerViewStore')
@observer
export class ButtonsTableProviderComponent extends React.Component {
    render() {
        const {original, providerViewStore} = this.props;
        return (
            <div className='table__buttons'>
                {providerViewStore.hasAuthorityEditProvider &&
                <ButtonEdit provider={original}/>
                }
                {providerViewStore.hasAuthorityDeleteProvider &&
                <ButtonDelete provider={original}/>
                }
            </div>
        );
    }
}

@inject('providerViewStore')
@observer
class ButtonEdit extends React.Component {
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
        const {providerViewStore, provider} = this.props;
        providerViewStore.showModalEditProvider(provider)
    };
}

@inject('providerViewStore')
@observer
class ButtonDelete extends React.Component {
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
        const {providerViewStore, provider} = this.props;
        providerViewStore.handleDeleteProvider(provider.id)
    };
}