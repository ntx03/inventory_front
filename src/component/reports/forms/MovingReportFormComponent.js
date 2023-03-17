import {Button, DatePicker, Form, Input} from 'antd';
import {inject, observer} from 'mobx-react';
import React from 'react';

@inject('reportsViewStore')
@observer
export class MovingReportFormComponent extends React.Component {
    state = {
        period: []
    };

    render() {
        const {period} = this.state;
        return (
            <Form style={{textAlign: 'center'}}>
                <Input.Group compact>
                    <DatePicker.RangePicker value={this.state.period}
                                            format='DD.MM.YYYY'
                                            onChange={this.handleSetPeriodDate}/>
                    <Button type='primary'
                            icon="download"
                            disabled={period.length === 0}
                            title="Скачать"
                            onClick={this.handleDownloadReport}>
                    </Button>
                </Input.Group>
            </Form>
        )
    }

    handleSetPeriodDate = period => {
        this.setState({period})
    };

    handleDownloadReport = () => {
        const {reportsViewStore} = this.props;
        reportsViewStore.handleMovingReport(this.state.period[0], this.state.period[1]);
    };

}

