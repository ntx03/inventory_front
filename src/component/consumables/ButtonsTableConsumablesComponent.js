import {Button, Popconfirm} from 'antd'
import {inject, observer} from 'mobx-react';
import React from 'react';

@inject('consumablesViewStore')
@observer
export class ButtonsTableConsumablesComponent extends React.Component {
    render() {
        const {original, consumablesViewStore} = this.props;
        const hasAuthorityChangeStateConsumables = consumablesViewStore.hasAuthorityChangeStateConsumables(original);
        const hasAuthorityMoveConsumables = consumablesViewStore.hasAuthorityMoveConsumables(original);
        const hasAuthorityEditConsumables = consumablesViewStore.hasAuthorityEditConsumables(original);
        const hasAuthorityDeleteConsumables = consumablesViewStore.hasAuthorityDeleteConsumables(original);
        return (
            <div className='table__buttons'>
                {hasAuthorityEditConsumables &&
                <ButtonEdit consumables={original}/>
                }
                {hasAuthorityChangeStateConsumables &&
                <ButtonChangeState consumables={original}/>
                }
                {hasAuthorityMoveConsumables &&
                <ButtonsEditConsignment consumables={original}/>
                }
                {hasAuthorityDeleteConsumables &&
                <ButtonDelete consumables={original}/>
                }
            </div>
        );
    }
}

@inject('consumablesViewStore')
@observer
class ButtonEdit extends React.Component {
    render() {
        return (
            <Button type="primary"
                    shape="circle"
                    ghost
                    icon="edit"
                    title="Редактировать"
                    onClick={this.handleClick}
            />
        )
    }

    handleClick = () => {
        const {consumablesViewStore, consumables} = this.props;
        consumablesViewStore.showModalEditConsumables(consumables);
    }
}

@inject('consumablesViewStore')
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
        const {consumablesViewStore, consumables} = this.props;
        consumablesViewStore.handleDeleteConsumables(consumables.id);
    }
}

@inject('consumablesViewStore')
@observer
class ButtonChangeState extends React.Component {
    render() {
        return (
            <Button shape="circle"
                    icon="tool"
                    title="Изменить состояние"
                    onClick={this.handleClick}/>
        )
    }

    handleClick = () => {
        const {consumablesViewStore, consumables} = this.props;
        consumablesViewStore.showModalChangeStateConsumables(consumables);
    }
}

@inject('consumablesViewStore')
@observer
class ButtonsEditConsignment extends React.Component {
    render() {
        const {consumables} = this.props;
        if (consumables.consignmentId) {
            return (
                <Popconfirm placement="left"
                            title={'Вы точно хотите удалить из накладной?'}
                            okText="Да"
                            cancelText="Нет"
                            onConfirm={this.handleDeleteClick}>
                    <Button shape="circle"
                            icon='file-excel'
                            ghost
                            type='danger'
                            title="Удалить из накладной"/>
                </Popconfirm>
            )
        }
        return (
            <Button shape="circle"
                    icon='file-add'
                    title="Добавить в накладную"
                    onClick={this.handleAddClick}/>
        )
    }

    handleAddClick = () => {
        const {consumablesViewStore, consumables} = this.props;
        consumablesViewStore.showModalEditConsignmentConsumables(consumables);
    };

    handleDeleteClick = () => {
        const {consumablesViewStore, consumables} = this.props;
        consumablesViewStore.handleRemoveConsignmentConsumables(consumables);
    };
}