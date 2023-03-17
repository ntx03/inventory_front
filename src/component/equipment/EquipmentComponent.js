import {Col, Input, Row} from 'antd'
import {ErrorComponent} from 'component/base/ErrorComponent';
import {LoadingComponent} from 'component/base/LoadingComponent';
import {ButtonsTitleEquipmentComponent} from 'component/equipment/ButtonsTitleEquipmentComponent';
import {EquipmentDescriptionCardComponent} from 'component/equipment/EquipmentDescriptionCardComponent';
import {EquipmentHistoryCardComponent} from 'component/equipment/EquipmentHistoryCardComponent';
import {FilterLocationComponent} from 'component/equipment/FilterLocationComponent';
import {TableEquipmentComponent} from 'component/equipment/TableEquipmentComponent';
import {LayoutContent} from 'layout/LayoutContent';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {EquipmentEditModalComponent} from "component/equipment/modals/EquipmentEditModalComponent";
import {EquipmentConsignmentEditModalComponent} from "component/equipment/modals/EquipmentConsignmentEditModalComponent";
import {ConsignmentCreateModalComponent} from "component/equipment/modals/ConsignmentCreateModalComponent";
import {EquipmentChangeStateModalComponent} from "component/equipment/modals/EquipmentChangeStateModalComponent";


@inject('equipmentViewStore')
@observer
export class EquipmentComponent extends React.Component {
    render() {
        const {equipmentViewStore} = this.props;
        if (equipmentViewStore.stateLoad.pending) {
            return <LoadingComponent/>
        }
        if (equipmentViewStore.stateLoad.errors) {
            return <ErrorComponent errors={equipmentViewStore.stateLoad.errors}/>
        }
        return (
            <LayoutContent title='Оборудование'
                           buttons={<ButtonsTitleEquipmentComponent/>}>
                <Row className='equipment'>
                    {/*{!equipmentViewStore.card &&*/}
                    {/*<Col span={5} className='equipment_location_list'>*/}
                    {/*<Input.Search className='search'*/}
                    {/*placeholder="Найти"*/}
                    {/*onChange={this.handleInputSearchChange}/>*/}
                    {/*<FilterLocationComponent/>*/}
                    {/*</Col>*/}
                    {/*}*/}
                    <Col span={!equipmentViewStore.card ? 24 : 19} className='equipment_list'>
                        <TableEquipmentComponent/>
                        <EquipmentEditModalComponent/>
                        <EquipmentConsignmentEditModalComponent/>
                        <EquipmentChangeStateModalComponent/>
                        <ConsignmentCreateModalComponent/>
                    </Col>
                    {equipmentViewStore.card &&
                    <Col span={5} className='equipment_card'>
                        {equipmentViewStore.card === 'CARD_EQUIPMENT_DESCRIPTION' &&
                        <EquipmentDescriptionCardComponent/>
                        }
                        {equipmentViewStore.card === 'CARD_EQUIPMENT_HISTORY' &&
                        <EquipmentHistoryCardComponent/>
                        }
                    </Col>
                    }
                </Row>
            </LayoutContent>
        )
    }

    handleInputSearchChange = e => {
        const {equipmentViewStore} = this.props;
        equipmentViewStore.setLocationIdListBySearchValue(e.target.value)
    };
}