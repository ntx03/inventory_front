import {Button} from 'antd'
import {inject, observer} from 'mobx-react';
import React from 'react';

@inject('consignmentViewStore')
@observer
export class ButtonsTableConsignmentAcceptComponent extends React.Component {
    render() {
        const {original, consignmentViewStore} = this.props;
        return (
            consignmentViewStore.hasAuthorityMove &&
            <div className='table__buttons'>
                <ButtonShow consignment={original}/>
            </div>
        );
    }
}

@inject('consignmentViewStore')
@observer
class ButtonShow extends React.Component {
    render() {
        return (
            <Button type="primary"
                    shape="circle"
                    ghost
                    icon='profile'
                    title="Просмотреть"
                    onClick={this.handleClick}/>
        )
    }

    handleClick = () => {
        const {consignmentViewStore, consignment} = this.props;
        consignmentViewStore.showModalAcceptedConsignment(consignment);
    };
}