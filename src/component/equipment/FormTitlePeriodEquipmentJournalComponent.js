import {inject, observer} from 'mobx-react/index';
import React from 'react';
import {Button, DatePicker, Form, Input} from "antd";
import {toJS} from "mobx";

@inject('equipmentJournalViewStore')
@observer
export class FormTitlePeriodEquipmentJournalComponent extends React.Component {
    render() {
        const {equipmentJournalViewStore} = this.props;
        const period = toJS(equipmentJournalViewStore.period);
        return (
            <Form layout="inline">
                <Input.Group compact>
                    <DatePicker.RangePicker value={period}
                                            defaultValue={period}
                                            format='DD.MM.YYYY'
                                            onChange={this.handleSetPeriodDate}/>
                    <Button type='primary'
                            icon="clock-circle-o"
                            disabled={period.length === 0}
                            title="Скачать"
                            onClick={this.handleDownloadReport}>
                    </Button>
                </Input.Group>
            </Form>
        )
    }

    handleSetPeriodDate = period => {
        const {equipmentJournalViewStore} = this.props;
        equipmentJournalViewStore.setPeriod(period);
    };

    handleDownloadReport = () => {
        const {equipmentJournalViewStore} = this.props;
        equipmentJournalViewStore.handleSetPeriodView()
    };
}