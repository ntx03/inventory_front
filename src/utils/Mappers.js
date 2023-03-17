import moment from 'moment';
import {consignmentStateEnum, equipmentOperationTypeEnum} from 'utils/Enums';

export class TimeLineProps {
    key = '';
    icon = '';
    textList = [];

    static fromOperation(operation, idMapper) {
        const props = new TimeLineProps();
        props.key = operation.id;
        props.userName = operation.user.name || 'Пользователь не задан';
        props.comment = operation.comment;
        props.consignment = operation.consignment;
        props.time = moment(operation.timestamp).format('DD.MM.YYYY LTS');
        props.textList.push(`${props.time}`);
        props.textList.push(`Пользователь: ${props.userName}`);

        if (operation.type === equipmentOperationTypeEnum.EQUIPMENT_ADD) {
            props.icon = 'plus';
            return props
        }
        if (operation.type === equipmentOperationTypeEnum.EQUIPMENT_EDIT) {
            props.icon = 'edit';

            return props
        }
        if (operation.type === equipmentOperationTypeEnum.EQUIPMENT_CHANGE_STATE) {
            const stateId = operation.meta.new.stateId;

            props.icon = 'tool';
            props.textList.push(`Состояние: ${idMapper.get(stateId)}`);
            return props
        }
        if (operation.type === equipmentOperationTypeEnum.EQUIPMENT_SEND) {
            const destinationLocationId = operation.consignment.destinationLocationId;
            const sourceLocationId = operation.consignment.sourceLocationId;
            const consignmentNumber = operation.consignment.number;
            const consignmentDate = operation.consignment.timestamp;

            props.icon = 'car';
            props.textList.push(`Откуда: ${idMapper.get(sourceLocationId)}`);
            props.textList.push(`Куда: ${idMapper.get(destinationLocationId)}`);
            props.textList.push(`Номер накладной: ${consignmentNumber}`);
            props.textList.push(`Накладная создана: ${moment(consignmentDate).format('DD.MM.YYYY LTS')}`);
            return props
        }
        if (operation.type === equipmentOperationTypeEnum.EQUIPMENT_ACCEPTED) {
            const destinationLocationId = operation.consignment.destinationLocationId;
            const sourceLocationId = operation.consignment.sourceLocationId;
            const state = operation.equipmentState;
            const consignmentNumber = operation.consignment.number;
            const consignmentDate = operation.consignment.timestamp;

            props.icon = 'gift';
            props.textList.push(`Откуда: ${idMapper.get(sourceLocationId)}`);
            props.textList.push(`Куда: ${idMapper.get(destinationLocationId)}`);
            props.textList.push(`Статус: ${state === consignmentStateEnum.RECEIVED ? 'Принят' : 'Не принят'}`);
            props.textList.push(`Номер накладной: ${consignmentNumber}`);
            props.textList.push(`Накладная создана: ${moment(consignmentDate).format('DD.MM.YYYY LTS')}`);
            return props
        }
        return props
    }
}