import {Button} from 'antd';
import {inject, observer} from 'mobx-react/index';
import React from 'react';

@inject('modelViewStore')
@observer
export class ButtonsTitleModelComponent extends React.Component {
    render() {
        const {modelViewStore} = this.props;
        return (
            <div>
                {modelViewStore.hasAuthorityAddModel &&
                <ButtonAdd/>
                }
            </div>
        )
    }
}

@inject('modelViewStore')
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
        const {modelViewStore} = this.props;
        modelViewStore.showModalAddModel();
    };
}