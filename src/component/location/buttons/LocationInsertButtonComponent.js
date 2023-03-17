import {Button} from 'antd';
import {inject, observer} from 'mobx-react';
import React from 'react';

@inject('locationViewStore')
@observer
export class LocationInsertButtonComponent extends React.Component {
    render() {
        return (
            <Button type="primary"
                    shape="circle"
                    ghost
                    icon="file-add"
                    style={{color: 'green', borderColor: 'green'}}
                    onClick={this.handleClick}
            />
        )
    }

    handleClick = () => {
        const {locationViewStore} = this.props;
        locationViewStore.handleInsertLocation();
    };
}
