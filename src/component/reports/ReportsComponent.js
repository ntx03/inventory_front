import {Card, Icon} from 'antd';
import {MovingReportFormComponent} from 'component/reports/forms/MovingReportFormComponent';
import {ServiceCenterReportFormComponent} from 'component/reports/forms/ServiceCenterReportFormComponent';
import {LayoutContent} from 'layout/LayoutContent';
import {inject, observer} from 'mobx-react';
import React from 'react';

@inject('reportsViewStore')
@observer
export class ReportsComponent extends React.Component {
    render() {
        const {reportsViewStore} = this.props;
        return (
            <LayoutContent title='Отчеты'>
                <Card className='reports' bordered={false}>
                    {reportsViewStore.hasAuthorityMovingReport &&
                    <Card.Grid className='report'>
                        <Icon className='report_cover' type="car"/>
                        <h3 className='report_title'>Перемещения за период</h3>
                        <h3 className='report_comment'>Отчет включает в себя информацию с даты начала по дату окончания (включительно)</h3>
                        <MovingReportFormComponent/>
                    </Card.Grid>
                    }
                    {reportsViewStore.hasAuthorityServiceCenterReport &&
                    <Card.Grid className='report'>
                        <Icon className='report_cover' type="tool"/>
                        <h3 className='report_title'>Перемещения в сервисный центр</h3>
                        <h3 className='report_comment'>Отчет включает в себя информацию с даты начала по дату окончания (включительно)</h3>
                        <ServiceCenterReportFormComponent/>
                    </Card.Grid>
                    }
                </Card>
            </LayoutContent>
        )
    }
}