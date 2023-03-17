import {EquipmentAddButtonComponent} from 'component/equipment/buttons/EquipmentAddButtonComponent';
import {inject, observer} from 'mobx-react/index';
import React from 'react';
import {ConsignmentCreateButtonComponent} from "component/equipment/buttons/ConsignmentCreateButtonComponent";
import {EquipmentsChangeStateButtonComponent} from "component/equipment/buttons/EquipmentsChangeStateButtonComponent";
import {EquipmentEditConsignmentButtonComponent} from "component/equipment/buttons/EquipmentEditConsignmentButtonComponent";

@inject('equipmentViewStore')
@observer
export class ButtonsTitleEquipmentComponent extends React.Component {
    render() {
        const {equipmentViewStore} = this.props;
        const countSelectedEquipment = equipmentViewStore.selectedEquipmentMap.size;
        const hasAuthorityAddEquipment = equipmentViewStore.hasAuthorityAddEquipment;
        const showConsignmentCreateButton = equipmentViewStore.hasAuthorityCreateConsignment;
        const hasAuthorityChangeStateEquipment = equipmentViewStore.hasAuthorityChangeStateEquipment;
        const hasAuthorityEditConsignmentEquipment = equipmentViewStore.hasAuthorityEditConsignmentEquipment;
        return (
            <div>
                {hasAuthorityAddEquipment &&
                <EquipmentAddButtonComponent/>
                }
                {showConsignmentCreateButton &&
                <ConsignmentCreateButtonComponent/>
                }
                {hasAuthorityChangeStateEquipment &&
                <EquipmentsChangeStateButtonComponent/>
                }
                {hasAuthorityEditConsignmentEquipment &&
                <EquipmentEditConsignmentButtonComponent/>
                }
            </div>
        )
    }
}