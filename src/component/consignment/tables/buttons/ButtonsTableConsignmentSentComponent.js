import {Button} from 'antd'
import {inject, observer} from 'mobx-react';
import React from 'react';

@inject('consignmentViewStore')
@observer
export class ButtonsTableConsignmentSentComponent extends React.Component {
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
        const {consignmentViewStore, consignment} = this.props;
        const imRecipient = consignmentViewStore.hasAuthorityAccept(consignment);
        return (
            <Button type="primary"
                    shape="circle"
                    ghost
                    icon={imRecipient ? 'solution' : 'profile'}
                    title="Принять"
                    onClick={this.handleClick}/>
        )
    }

    handleClick = () => {
        const {consignmentViewStore, consignment} = this.props;
        const imRecipient = consignmentViewStore.hasAuthorityAccept(consignment);
        if (imRecipient) {
            consignmentViewStore.showModalAcceptConsignment(consignment);
        } else {
            consignmentViewStore.showModalSentConsignment(consignment);
        }
    };
}