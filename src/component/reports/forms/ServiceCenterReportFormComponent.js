import {Button, DatePicker, Form, Input, InputNumber, Popover} from 'antd';
import {inject, observer} from 'mobx-react';
import React from 'react';

@inject('reportsViewStore')
@observer
export class ServiceCenterReportFormComponent extends React.Component {
    state = {
        period: [],
        delayDays: 0
    };

    render() {
        const {period} = this.state;
        return (
            <Form style={{textAlign: 'center'}}>
                <Input.Group compact>
                    <DatePicker.RangePicker value={this.state.period}
                                            format='DD.MM.YYYY'
                                            onChange={this.handleSetPeriodDate}/>
                    <Popover placement="bottomLeft" content='Включить в отчет информацию об оборудовании, находившемся в СЦ дольше указанного количества дней' trigger="hover">
                        <InputNumber value={this.state.delayDays}
                                     placeholder='Дней'
                                     min={0}
                                     precision={0}
                                     onChange={this.handleSetDelayDays}/>
                    </Popover>
                    <Button type='primary'
                            icon="download"
                            disabled={period.length === 0}
                            onClick={this.handleDownloadReport}>
                    </Button>
                </Input.Group>
            </Form>
        )
    }

    handleSetPeriodDate = period => {
        this.setState({period})
    };

    handleSetDelayDays = delayDays => {
        this.setState({delayDays})
    };

    handleDownloadReport = () => {
        const {reportsViewStore} = this.props;
        reportsViewStore.handleServiceCenterReport(
            this.state.period[0], this.state.period[1], this.state.delayDays);
    };

}

