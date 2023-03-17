import {Button} from 'antd';
import {inject, observer} from 'mobx-react/index';
import React from 'react';

@inject('providerViewStore')
@observer
export class ButtonsTitleProviderComponent extends React.Component {
    render() {
        const {providerViewStore} = this.props;
        return (
            <div>
                {providerViewStore.hasAuthorityAddProvider &&
                <ButtonAdd/>
                }
            </div>
        )
    }
}

@inject('providerViewStore')
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
        const {providerViewStore} = this.props;
        providerViewStore.showModalAddProvider();
    };
}