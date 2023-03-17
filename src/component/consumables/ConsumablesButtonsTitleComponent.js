import {Button} from 'antd';
import {inject, observer} from 'mobx-react/index';
import React from 'react';

@inject('consumablesViewStore')
@observer
export class ConsumablesButtonsTitleComponent extends React.Component {
    render() {
        const {consumablesViewStore} = this.props;
        const hasAuthorityAddConsumables = consumablesViewStore.hasAuthorityAddConsumables;
        return (
            <div>
                {hasAuthorityAddConsumables &&
                <ButtonAdd/>
                }
            </div>
        )
    }
}

@inject('consumablesViewStore')
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
        const {consumablesViewStore} = this.props;
        consumablesViewStore.showModalAddConsumables();
    };
}