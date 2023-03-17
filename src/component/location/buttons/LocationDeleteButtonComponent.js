import {Button, Popconfirm} from 'antd';
import {inject, observer} from 'mobx-react';
import React from 'react';

@inject('locationViewStore')
@observer
export class LocationDeleteButtonComponent extends React.Component {
    render() {
        return (
            <Popconfirm placement="left"
                        title={'Вы точно хотите удалить?'}
                        okText="Да"
                        cancelText="Нет"
                        onConfirm={this.handleClick}>
                <Button type="danger"
                        shape="circle"
                        ghost
                        icon="delete"/>
            </Popconfirm>
        )
    }

    handleClick = () => {
        const {locationViewStore} = this.props;
        locationViewStore.handleDeleteLocation();
    };
}
