export const consignmentStateEnum = {
    SENT: 'SENT',
    CREATED: 'CREATED',
    RECEIVED: 'RECEIVED',
    NOT_RECEIVED: 'NOT_RECEIVED'
};

export const equipmentOperationTypeEnum = {
    EQUIPMENT_ADD: 'AddEquipmentOperation',
    EQUIPMENT_EDIT: 'EditEquipmentOperation',
    EQUIPMENT_SEND: 'MoveEquipmentOperation',
    EQUIPMENT_CHANGE_STATE: 'ChangeStateEquipmentOperation',
    EQUIPMENT_ACCEPTED: 'ReceiveEquipmentOperation',
    EQUIPMENT_DELETE: 'DeleteEquipmentOperation'
};

export const consumablesOperationTypeEnum = {
    CONSUMABLES_ADD: 'AddConsumablesOperation',
    CONSUMABLES_EDIT: 'EditConsumablesOperation',
    CONSUMABLES_DELETE: 'DeleteConsumablesOperation'
};