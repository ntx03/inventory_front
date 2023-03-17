import {Button} from 'antd';
import {inject, observer} from 'mobx-react';
import React from 'react';

@inject('locationViewStore')
@observer
export class LocationCopyButtonComponent extends React.Component {
    render() {
        return (
            <Button type="primary"
                    shape="circle"
                    ghost
                    icon="copy"
                    onClick={this.handleClick}/>
        )
    }

    handleClick = () =>{
        const {locationViewStore} = this.props;
        locationViewStore.handleCopyLocation()
    }
}
