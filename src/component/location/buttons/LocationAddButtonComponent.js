import {Button} from 'antd';
import {inject, observer} from 'mobx-react';
import React from 'react';

@inject('locationViewStore')
@observer
export class LocationAddButtonComponent extends React.Component {
    render() {
        return (
            <Button type="primary"
                    shape="circle"
                    ghost
                    icon="plus"
                    onClick={this.handleClick}/>
        )
    }

    handleClick = () => {
        const {locationViewStore} = this.props;
        locationViewStore.handleAddLocation();
    };
}
