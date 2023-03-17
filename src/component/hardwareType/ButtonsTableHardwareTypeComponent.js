import React from 'react';
import {inject, observer} from 'mobx-react';
import {Button, Popconfirm} from 'antd'

@inject('hardwareTypeViewStore')
@observer
export class ButtonsTableHardwareTypeComponent extends React.Component {
    render() {
        const {original, hardwareTypeViewStore} = this.props;
        return (
            <div className='table__buttons'>
                {hardwareTypeViewStore.hasAuthorityEditHardwareType &&
                <ButtonEdit hardwareType={original}/>
                }
                {hardwareTypeViewStore.hasAuthorityDeleteHardwareType &&
                <ButtonDelete hardwareType={original}/>
                }
            </div>
        );
    }
}

@inject('hardwareTypeViewStore')
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
        const {hardwareTypeViewStore, hardwareType} = this.props;
        hardwareTypeViewStore.showModalEditHardwareType(hardwareType)
    };
}

@inject('hardwareTypeViewStore')
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
        const {hardwareTypeViewStore, hardwareType} = this.props;
        hardwareTypeViewStore.handleDeleteHardwareType(hardwareType.id)
    };
}