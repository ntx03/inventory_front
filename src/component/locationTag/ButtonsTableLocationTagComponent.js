import {Button, Popconfirm} from 'antd'
import {inject, observer} from 'mobx-react';
import React from 'react';

@inject('locationTagViewStore')
@observer
export class ButtonsTableLocationTagComponent extends React.Component {
    render() {
        const {original, locationTagViewStore} = this.props;
        return (
            <div className='table__buttons'>
                {locationTagViewStore.hasAuthorityEditLocationTag &&
                <ButtonEdit locationTag={original}/>
                }
                {locationTagViewStore.hasAuthorityDeleteLocationTag &&
                <ButtonDelete locationTag={original}/>
                }
            </div>
        );
    }
}

@inject('locationTagViewStore')
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
        const {locationTagViewStore, locationTag} = this.props;
        locationTagViewStore.showModalEditLocationTag(locationTag)
    };
}

@inject('locationTagViewStore')
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
        const {locationTagViewStore, locationTag} = this.props;
        locationTagViewStore.handleDeleteLocationTag(locationTag.id)
    };
}