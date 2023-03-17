import {Button} from 'antd';
import {inject, observer} from 'mobx-react/index';
import React from 'react';

@inject('stateViewStore')
@observer
export class ButtonsTitleStateComponent extends React.Component {
    render() {
        const {stateViewStore} = this.props;
        return (
            <div>
                {stateViewStore.hasAuthorityAddState &&
                <ButtonAdd/>
                }
            </div>
        )
    }
}

@inject('stateViewStore')
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
        const {stateViewStore} = this.props;
        stateViewStore.showModalAddState();
    };
}