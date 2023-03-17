import {EquipmentDeleteButtonComponent} from 'component/equipment/buttons/EquipmentDeleteButtonComponent';
import {EquipmentEditButtonComponent} from 'component/equipment/buttons/EquipmentEditButtonComponent';
import {EquipmentHistoryButtonComponent} from 'component/equipment/buttons/EquipmentHistoryButtonComponent';
import {EquipmentRemoveConsignmentButtonComponent} from 'component/equipment/buttons/EquipmentRemoveConsignmentButtonComponent';
import {EquipmentDescriptionButtonComponent} from 'component/equipment/buttons/EquipmentDescriptionButtonComponent';
import {inject, observer} from 'mobx-react';
import React from 'react';

@inject('equipmentViewStore')
@observer
export class EquipmentTableButtonsComponent extends React.Component {
    render() {
        const {equipmentViewStore, original} = this.props;
        const hasAuthorityEditEquipment = equipmentViewStore.hasAuthorityEditEquipment(original);
        const hasAuthorityDeleteEquipment = equipmentViewStore.hasAuthorityDeleteEquipment(original);
        const hasEquipmentInConsignment = equipmentViewStore.hasEquipmentInConsignment(original);
        // const hasEquipmentInConsignmentSent = equipmentViewStore.hasEquipmentInConsignmentSent(original);
        const hasEquipmentInConsignmentCreated = equipmentViewStore.hasEquipmentInConsignmentCreated(original);
        return (
            hasEquipmentInConsignment ?
                <div className='table__buttons'>
                    <EquipmentDescriptionButtonComponent equipment={original}/>
                    <EquipmentHistoryButtonComponent equipment={original}/>
                    {hasEquipmentInConsignmentCreated &&
                    <EquipmentRemoveConsignmentButtonComponent equipment={original}/>
                    }
                </div>
                :
                <div className='table__buttons'>
                    <EquipmentDescriptionButtonComponent equipment={original}/>
                    <EquipmentHistoryButtonComponent equipment={original}/>
                    {hasAuthorityEditEquipment &&
                    <EquipmentEditButtonComponent equipment={original}/>
                    }
                    {hasAuthorityDeleteEquipment &&
                    <EquipmentDeleteButtonComponent equipment={original}/>
                    }
                </div>
        );
    }
}