import React from 'react'
import {inject} from 'mobx-react';
import {Button, Icon} from 'antd'
import {notification} from 'utils/Notification';

@inject('controllerStore')
export class ErrorComponent extends React.Component {
    render() {
        return (
            <div className='error'>
                <Icon
                    className='error_icon'
                    type="warning"
                />
                <Button type="primary" icon="sync" onClick={this.handleReloadPageClick}>
                    Обновить
                </Button>
            </div>
        )
    }

    constructor(props) {
        super(props);
        this.showErrors(props.errors);
    }

    componentWillReceiveProps(props) {
        const oldValues = new Set();
        this.props.errors.forEach(item => {
            oldValues.add(item.value);
        });
        const newErrors = [];
        props.errors.forEach(item => {
            if (!oldValues.has(item.value)) {
                newErrors.push(item);
            }
        });
        this.showErrors(newErrors);
    }

    showErrors(errors) {
        errors.forEach(item => {
            const warning = item.value;
            notification.error(warning);
        });
    }

    handleReloadPageClick = () => {
        const {controllerStore} = this.props;
        controllerStore.navigate(controllerStore.controllerName);
    }
}