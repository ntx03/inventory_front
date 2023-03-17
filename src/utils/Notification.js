import React from 'react'
import {Icon, notification as notificationAntd} from 'antd';

class Notification {
    error(error) {
        setTimeout(() => {
            notificationAntd['error']({
                message: error.message,
                description: error.path,
                icon: <Icon style={{ color: 'red' }} type="warning"/>,
                duration: null
            })
        }, 0);
    }
}

export const notification = new Notification();
