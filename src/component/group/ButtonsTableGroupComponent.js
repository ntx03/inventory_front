import {Button, Popconfirm} from 'antd'
import {inject, observer} from 'mobx-react';
import React from 'react';

@inject('groupViewStore')
@observer
export class ButtonsTableGroupComponent extends React.Component {
    render() {
        const {original, groupViewStore} = this.props;
        return (
            <div className='table__buttons'>
                {groupViewStore.hasAuthorityEditGroup &&
                <ButtonEdit group={original}/>
                }
                {groupViewStore.hasAuthorityDeleteGroup &&
                <ButtonDelete group={original}/>
                }
            </div>
        );
    }
}

@inject('groupViewStore')
@observer
class ButtonEdit extends React.Component {
    render() {
        const {groupViewStore, group} = this.props;
        return (
            <Button type="primary"
                    shape="circle"
                    ghost
                    icon="edit"
                    title="Редактировать"
                    onClick={() => groupViewStore.showModalEditGroup(group)}
            />
        )
    }
}

@inject('groupViewStore')
@observer
class ButtonDelete extends React.Component {
    render() {
        const {groupViewStore, group} = this.props;
        return (
            <Popconfirm placement="left"
                        title={'Вы точно хотите удалить?'}
                        okText="Да"
                        cancelText="Нет"
                        onConfirm={() => groupViewStore.handleDeleteGroup(group.id)}>
                <Button type="danger"
                        shape="circle"
                        ghost
                        icon="delete"
                        title="Удалить"/>
            </Popconfirm>
        )
    }
}