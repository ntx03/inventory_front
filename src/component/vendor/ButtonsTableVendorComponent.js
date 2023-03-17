import {Button, Popconfirm} from 'antd'
import {inject, observer} from 'mobx-react';
import React from 'react';

@inject('vendorViewStore')
@observer
export class ButtonsTableVendorComponent extends React.Component {
    render() {
        const {original, vendorViewStore} = this.props;
        return (
            <div className='table__buttons'>
                {vendorViewStore.hasAuthorityEditVendor &&
                <ButtonEdit vendor={original}/>
                }
                {vendorViewStore.hasAuthorityDeleteVendor &&
                <ButtonDelete vendor={original}/>
                }
            </div>
        );
    }
}

@inject('vendorViewStore')
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
        const {vendorViewStore, vendor} = this.props;
        vendorViewStore.showModalEditVendor(vendor)
    };
}

@inject('vendorViewStore')
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
        const {vendorViewStore, vendor} = this.props;
        vendorViewStore.handleDeleteVendor(vendor.id)
    };
}