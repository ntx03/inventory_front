import {Button} from 'antd';
import {inject, observer} from 'mobx-react/index';
import React from 'react';

@inject('locationTagViewStore')
@observer
export class ButtonsTitleLocationTagComponent extends React.Component {
    render() {
        const {locationTagViewStore} = this.props;
        return (
            <div>
                {locationTagViewStore.hasAuthorityAddLocationTag &&
                <ButtonAdd/>
                }
            </div>
        )
    }
}

@inject('locationTagViewStore')
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
        const {locationTagViewStore} = this.props;
        locationTagViewStore.showModalAddLocationTag();
    };
}