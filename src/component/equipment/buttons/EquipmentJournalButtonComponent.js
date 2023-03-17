import {inject, observer} from "mobx-react/index";
import React from "react";
import {Button} from 'antd';

@inject('equipmentJournalViewStore')
@observer
export class EquipmentJournalButtonComponent extends React.Component {
    render() {
        return (
            <div className='table__buttons'>
                <Button type="dashed"
                        shape="circle"
                        icon="file-text"
                        title="Накладная"
                        onClick={this.handleClick}/>
            </div>
        )
    }

    handleClick = () => {
        const {equipmentJournalViewStore, consignment, comment} = this.props;
        equipmentJournalViewStore.showModalViewConsignment(consignment, comment)
    }
}
