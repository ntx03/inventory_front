import {Button} from 'antd';
import {inject, observer} from 'mobx-react/index';
import React from 'react';

@inject('consignmentViewStore')
@observer
export class ButtonsTitleConsignmentComponent extends React.Component {
    render() {
        const {consignmentViewStore} = this.props;
        return (
            <div>
                {consignmentViewStore.hasAuthorityMove &&
                <ButtonAdd/>
                }
            </div>
        )
    }
}

@inject('consignmentViewStore')
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
        const {consignmentViewStore} = this.props;
        consignmentViewStore.showModalAddConsignment();
    };
}