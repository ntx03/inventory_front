import React from 'react';
import {Select} from 'antd';
import {toJS} from 'mobx';
import {SessionStore} from '../store/SessionStore';

export class BooleanFilter {
    constructor(key, trueTitle, falseTitle) {
        this.store = new SessionStore(key, []);
        this.trueTitle = trueTitle;
        this.falseTitle = falseTitle;
    }

    filterMethod = (filter, row) => {
        if (typeof this.store.value === 'string' && this.store.value !== '') {
            const value = (this.store.value === 'true');
            const cellBoolean = row[filter.id];
            return value === cellBoolean;
        } else {
            return true
        }

    };

    filterComponent = () => {
        return (
            <Select
                style={{width: '100%'}}
                defaultValue={toJS(this.store.value)}
                onChange={this.handleChange}
                allowClear
            >
                <Select.Option key='true'>{this.trueTitle}</Select.Option>
                <Select.Option key='false'>{this.falseTitle}</Select.Option>
            </Select>
        )
    };

    handleChange = (value) => {
        this.store.setValue(value ? value : '');
    }
}
