import React from 'react';
import {Select} from 'antd';
import {toJS} from 'mobx';
import {SessionStore} from '../store/SessionStore';

export class TextFilter {
    constructor(key, mapCellValue) {
        this.store = new SessionStore(key, []);
        this.mapCellValue = mapCellValue || (value => value);
    }

    filterMethod = (filter, row) => {
        const cellString = this.mapCellValue(row[filter.id]) ? this.mapCellValue(row[filter.id]).toLowerCase() : '';
        const value = this.store.value;
        return !value.length || value.some(s => {
            return cellString.includes(s.toLowerCase())
        });
    };

    filterComponent = () => (
        <Select
            mode="tags"
            style={{width: '100%'}}
            defaultValue={toJS(this.store.value)}
            onChange={this.handleChange}
        />
    );

    handleChange = (value) => {
        this.store.setValue(value);
    }
}
