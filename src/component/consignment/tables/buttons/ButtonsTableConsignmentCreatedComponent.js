import {Button, Popconfirm} from 'antd'
import {inject, observer} from 'mobx-react';
import React from 'react';

@inject('consignmentViewStore')
@observer
export class ButtonsTableConsignmentCreatedComponent extends React.Component {
    render() {
        const {original, consignmentViewStore} = this.props;
        return (
            consignmentViewStore.hasAuthorityMove &&
            <div className='table__buttons'>
                <ButtonEdit consignment={original}/>
                <ButtonMove consignment={original}/>
                <ButtonDelete consignment={original}/>
            </div>
        );
    }
}

@inject('consignmentViewStore')
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
        const {consignmentViewStore, consignment} = this.props;
        consignmentViewStore.showModalEditConsignment(consignment);
    };
}

@inject('consignmentViewStore')
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
        const {consignmentViewStore, consignment} = this.props;
        consignmentViewStore.handleDeleteConsignment(consignment.id)
    };
}

@inject('consignmentViewStore')
@observer
class ButtonMove extends React.Component {
    render() {
        return (
            <Button type="primary"
                    shape="circle"
                    ghost
                    icon="solution"
                    title="Отправить"
                    onClick={this.handleClick}/>
        )
    }

    handleClick = () => {
        const {consignmentViewStore, consignment} = this.props;
        consignmentViewStore.showModalSendConsignment(consignment);
    };
}