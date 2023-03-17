import {inject, observer} from 'mobx-react';
import {Icon, Tag} from 'antd';
import React from 'react';
import {equipmentOperationTypeEnum} from 'utils/Enums';

@inject('equipmentViewStore')
@observer
export class EquipmentHistoryFilterButtonsComponent extends React.Component {
    render() {
        const {equipmentViewStore} = this.props;
        const filterOperationSelectSet = equipmentViewStore.filterOperationSelectSet;
        return (
            <div className='equipment_card_history_filter'>
                <Tag.CheckableTag checked={filterOperationSelectSet.has(equipmentOperationTypeEnum.EQUIPMENT_CHANGE_STATE)}
                                  onChange={this.handleEquipmentStateChangeFilterClick}>
                    <Icon type='tool'/>
                    <h6>Изменено состояние</h6>
                </Tag.CheckableTag>
                <Tag.CheckableTag checked={filterOperationSelectSet.has(equipmentOperationTypeEnum.EQUIPMENT_SEND)}
                                  onChange={this.handleEquipmentSendFilterClick}>
                    <Icon type='car'/>
                    <h6>Отправлено</h6>
                </Tag.CheckableTag>
                <Tag.CheckableTag checked={filterOperationSelectSet.has(equipmentOperationTypeEnum.EQUIPMENT_ACCEPTED)}
                                  onChange={this.handleEquipmentAcceptedFilterClick}>
                    <Icon type='gift'/>
                    <h6>Доставлено</h6>
                </Tag.CheckableTag>
                <Tag.CheckableTag checked={filterOperationSelectSet.has(equipmentOperationTypeEnum.EQUIPMENT_ADD)}
                                  onChange={this.handleEquipmentAddFilterClick}>
                    <Icon type='plus'/>
                    <h6>Создано</h6>
                </Tag.CheckableTag>
                <Tag.CheckableTag checked={filterOperationSelectSet.has(equipmentOperationTypeEnum.EQUIPMENT_EDIT)}
                                  onChange={this.handleEquipmentEditFilterClick}>
                    <Icon type='edit'/>
                    <h6>Изменено</h6>
                </Tag.CheckableTag>
            </div>
        );
    }

    handleEquipmentStateChangeFilterClick = checked => {
        const {equipmentViewStore} = this.props;
        equipmentViewStore.setFilterOperation(checked, equipmentOperationTypeEnum.EQUIPMENT_CHANGE_STATE);
    };

    handleEquipmentSendFilterClick = checked => {
        const {equipmentViewStore} = this.props;
        equipmentViewStore.setFilterOperation(checked, equipmentOperationTypeEnum.EQUIPMENT_SEND);
    };

    handleEquipmentAcceptedFilterClick = checked => {
        const {equipmentViewStore} = this.props;
        equipmentViewStore.setFilterOperation(checked, equipmentOperationTypeEnum.EQUIPMENT_ACCEPTED);
    };

    handleEquipmentAddFilterClick = checked => {
        const {equipmentViewStore} = this.props;
        equipmentViewStore.setFilterOperation(checked, equipmentOperationTypeEnum.EQUIPMENT_ADD);
    };

    handleEquipmentEditFilterClick = checked => {
        const {equipmentViewStore} = this.props;
        equipmentViewStore.setFilterOperation(checked, equipmentOperationTypeEnum.EQUIPMENT_EDIT);
    };
}