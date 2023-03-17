import {Card, Icon} from 'antd';
import {ErrorComponent} from 'component/base/ErrorComponent';
import {LoadingComponent} from 'component/base/LoadingComponent';
import {EquipmentHistoryFilterButtonsComponent} from 'component/equipment/equipmentHistory/EquipmentHistoryFilterButtonsComponent';
import {EquipmentHistoryTimeLineComponent} from 'component/equipment/equipmentHistory/EquipmentHistoryTimeLineComponent';
import {inject, observer} from 'mobx-react';
import React from 'react';


@inject('equipmentViewStore')
@observer
export class EquipmentHistoryCardComponent extends React.Component {
    render() {
        const {equipmentViewStore} = this.props;
        if (equipmentViewStore.stateLoadHistory.pending) {
            return <LoadingComponent/>
        }
        if (equipmentViewStore.stateLoadHistory.errors) {
            return <ErrorComponent errors={equipmentViewStore.stateLoad.errors}/>
        }

        return (
            <Card className='equipment_card_history'
                  title='История'
                  extra={
                      <Icon className='equipment_card_history-close'
                            type='close'
                            onClick={this.handleCardClose}/>
                  }
                  bordered={false}>
                <EquipmentHistoryFilterButtonsComponent/>
                <EquipmentHistoryTimeLineComponent/>
            </Card>
        )
    }

    handleCardClose = () => {
        const {equipmentViewStore} = this.props;
        equipmentViewStore.hideCard();
    }
}
