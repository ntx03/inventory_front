import {Button, Icon, Modal, Timeline} from 'antd';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {TimeLineProps} from 'utils/Mappers';
import {FormViewConsignmentComponent} from 'component/consignment/forms/FormViewConsignmentComponent';
import {ModalViewConsignmentComponent} from "component/consignment/modals/ModalViewConsignmentComponent";

@inject('equipmentViewStore')
@observer
export class EquipmentHistoryTimeLineComponent extends React.Component {
    render() {
        const {equipmentViewStore} = this.props;
        const renderHistoryOperation = operationList => {
            return operationList
                .filter(equipmentViewStore.filterOperation)
                .map(item => {
                        const timeLineProps = TimeLineProps.fromOperation(item, equipmentViewStore.idMapper);
                        const handleShowComment = () => {
                            Modal.info({
                                title: 'Комментарий',
                                content: timeLineProps.comment,
                            });
                        };
                        const handleShowConsignment = () => {
                            const {equipmentViewStore} = this.props;
                            equipmentViewStore.showModalViewConsignment(timeLineProps.consignment, timeLineProps.comment);
                        };
                        return (
                            <Timeline.Item key={timeLineProps.key}
                                           dot={<Icon type={timeLineProps.icon}/>}>
                                {timeLineProps.textList.map((item, index) => <p key={index}>{item}</p>)}
                                {timeLineProps.consignment &&
                                <Button size='small'
                                        type="dashed"
                                        onClick={handleShowConsignment}>
                                    Накладная
                                </Button>
                                }
                                {timeLineProps.comment &&
                                <Button size='small'
                                        type="dashed"
                                        onClick={handleShowComment}>
                                    Комментарий
                                </Button>
                                }
                            </Timeline.Item>

                        )
                    }
                )
        };
        return (
            <div className='equipment_card_history_timeline'>
                <div>
                    <Timeline>
                        {renderHistoryOperation(equipmentViewStore.equipmentHistory)}
                    </Timeline>
                    <ModalViewConsignmentComponent/>
                </div>
            </div>
        )

    }

}