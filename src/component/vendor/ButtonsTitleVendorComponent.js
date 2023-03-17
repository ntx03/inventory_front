import {Button} from 'antd';
import {inject, observer} from 'mobx-react/index';
import React from 'react';

@inject('vendorViewStore')
@observer
export class ButtonsTitleVendorComponent extends React.Component {
    render() {
        const {vendorViewStore} = this.props;
        return (
            <div>
                {vendorViewStore.hasAuthorityAddVendor &&
                <ButtonAdd/>
                }
            </div>
        )
    }
}

@inject('vendorViewStore')
@observer
class ButtonAdd extends React.Component {
    render() {
        return (
            <Button type="primary"
                    icon="plus"
                    onClick={this.handleClick}>
                Добавить
            </Button>
        )
    }
    handleClick = () => {
        const {vendorViewStore} = this.props;
        vendorViewStore.showModalAddVendor();
    };
}