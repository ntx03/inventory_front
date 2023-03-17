import {Select} from 'antd';
import {RenderSelectOption} from 'component/base/RenderSelectOptionOfList';
import {toJS} from 'mobx';
import React from 'react';
import {filterOption} from 'utils/filterOption';
import {SessionStore} from '../store/SessionStore';

export class IdFilter {
    constructor(key, getList, mapCellValue) {
        this.store = new SessionStore(key, []);
        this.getList = getList;
        this.mapCellValue = mapCellValue || (value => value);
    }

    filterMethod = (filter, row) => {
        const id = this.mapCellValue(row[filter.id]);
        const value = this.store.value;
        return !value.length || value.some(s => {
            return s === id
        });
    };

    filterComponent = () => {
        return (
            <Select
                showSearch
                mode="multiple"
                style={{width: '100%'}}
                defaultValue={toJS(this.store.value)}
                onChange={this.handleChange}
                filterOption={filterOption}>
                {RenderSelectOption.byName(this.getList())}
            </Select>
        )
    };

    handleChange = (value) => {
        this.store.setValue(value);
    }
}
