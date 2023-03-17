import {RenderSelectOption} from 'component/base/RenderSelectOptionOfList';
import React from 'react';
import {Select} from 'antd';
import {toJS} from 'mobx';
import {filterOption} from 'utils/filterOption';
import {SessionStore} from '../store/SessionStore';

export class IdListFilter {
    constructor(key, getList, mapCellValue) {
        this.store = new SessionStore(key, []);
        this.getList = getList;
        this.mapCellValue = mapCellValue || (value => value);
    }

    filterMethod = (filter, row) => {
        const idList = this.mapCellValue(row[filter.id]);
        const value = this.store.value;
        return !value.length || value.some(s => {
            return idList.includes(s)
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
                filterOption={filterOption}
            >
                {RenderSelectOption.byName(this.getList())}
            </Select>
        )
    };

    handleChange = (value) => {
        this.store.setValue(value);
    }
}
