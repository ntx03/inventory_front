import React from 'react';
import {inject, observer} from 'mobx-react';
import {Button, Popconfirm} from 'antd'

@inject('stateViewStore')
@observer
export class ButtonsTableStateComponent extends React.Component {
    render() {
        const {original, stateViewStore} = this.props;
        return (
            <div className='table__buttons'>
                {stateViewStore.hasAuthorityEditState &&
                <ButtonEdit state={original}/>
                }
                {stateViewStore.hasAuthorityDeleteState &&
                <ButtonDelete state={original}/>
                }
            </div>
        );
    }
}

@inject('stateViewStore')
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
        const {stateViewStore, state} = this.props;
        stateViewStore.showModalEditState(state)
    };
}

@inject('stateViewStore')
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
        const {stateViewStore, state} = this.props;
        stateViewStore.handleDeleteState(state.id)
    };
}