import React from 'react';
import {inject, observer} from 'mobx-react';
import {Button, Popconfirm} from 'antd'

@inject('modelViewStore')
@observer
export class ButtonsTableModelComponent extends React.Component {
    render() {
        const {original, modelViewStore} = this.props;
        return (
            <div className='table__buttons'>
                {modelViewStore.hasAuthorityEditModel &&
                <ButtonEdit model={original}/>
                }
                {modelViewStore.hasAuthorityDeleteModel &&
                <ButtonDelete model={original}/>
                }
            </div>
        );
    }
}

@inject('modelViewStore')
@observer
class ButtonEdit extends React.Component {
    render() {
        const {modelViewStore, model} = this.props;
        return (
            <Button type="primary"
                    shape="circle"
                    ghost
                    icon="edit"
                    title="Редактировать"
                    onClick={() => modelViewStore.showModalEditModel(model)}
            />
        )
    }
}

@inject('modelViewStore')
@observer
class ButtonDelete extends React.Component {
    render() {
        const {modelViewStore, model} = this.props;
        return (
            <Popconfirm placement="left"
                        title={'Вы точно хотите удалить?'}
                        okText="Да"
                        cancelText="Нет"
                        onConfirm={() => modelViewStore.handleDeleteModel(model.id)}>
                <Button type="danger"
                        shape="circle"
                        ghost
                        icon="delete"
                        title="Удалить"/>
            </Popconfirm>
        )
    }
}