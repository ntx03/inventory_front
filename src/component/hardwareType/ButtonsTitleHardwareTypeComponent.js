import {Button} from 'antd';
import {inject, observer} from 'mobx-react/index';
import React from 'react';

@inject('hardwareTypeViewStore')
@observer
export class ButtonsTitleHardwareTypeComponent extends React.Component {
    render() {
        const {hardwareTypeViewStore} = this.props;
        return (
            <div>
                {hardwareTypeViewStore.hasAuthorityAddHardwareType &&
                <ButtonAdd/>
                }
            </div>
        )
    }
}

@inject('hardwareTypeViewStore')
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
        const {hardwareTypeViewStore} = this.props;
        hardwareTypeViewStore.showModalAddHardwareType();
    };
}