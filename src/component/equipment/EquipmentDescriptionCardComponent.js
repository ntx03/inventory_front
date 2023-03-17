import {Card, Icon} from 'antd';
import {EquipmentEditFormComponent} from 'component/equipment/forms/EquipmentEditFormComponent';
import {inject, observer} from 'mobx-react';
import React from 'react';


@inject('equipmentViewStore')
@observer
export class EquipmentDescriptionCardComponent extends React.Component {
    render() {
        const {equipmentViewStore} = this.props;
        return (
            <Card title='Карточка оборудования'
                  extra={
                      <Icon className='equipment_card_history-close'
                            type='close'
                            onClick={this.handleCardClose}/>
                  }
                  bordered={false}>
                <EquipmentEditFormComponent disabled={true}/>
            </Card>
        )
    }

    handleCardClose = () => {
        const {equipmentViewStore} = this.props;
        equipmentViewStore.hideCard();
    }
}
