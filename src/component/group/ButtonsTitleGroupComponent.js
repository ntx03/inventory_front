import {Button} from 'antd';
import {inject, observer} from 'mobx-react/index';
import React from 'react';

@inject('groupViewStore')
@observer
export class ButtonsTitleGroupComponent extends React.Component {
    render() {
        const {groupViewStore} = this.props;
        return (
            <div>
                {groupViewStore.hasAuthorityAddGroup &&
                <ButtonAdd/>
                }
            </div>
        )
    }
}

@inject('groupViewStore')
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
        const {groupViewStore} = this.props;
        groupViewStore.showModalAddGroup();
    };
}