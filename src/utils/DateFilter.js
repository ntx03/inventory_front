import {DatePicker} from 'antd';
import moment from 'moment';
import React from 'react';
import {SessionStore} from '../store/SessionStore';

export class DateFilter {
    constructor(key, mapCellValue) {
        this.store = new SessionStore(key, []);
        this.mapCellValue = mapCellValue || (value => value);
    }

    filterMethod = (filter, row) => {
        const period = this.store.value;
        if (period.length === 0) {
            return true
        }
        const date = this.mapCellValue(row[filter.id]);
        return date.isSameOrAfter(period[0]) && date.isSameOrBefore(period[1])
    };

    filterComponent = () => {
        const period = this.store.value.map(item => moment(item));
        return (
            <DatePicker.RangePicker defaultValue={period}
                                    onChange={this.handleChange} />
        )
    };

    handleChange = (value) => {
        this.store.setValue(value);
    }
}
