import {ContractAddButtonComponent} from 'component/contract/buttons/ContractAddButtonComponent';
import {inject, observer} from 'mobx-react/index';
import React from 'react';

@inject('contractViewStore')
@observer
export class ContractTitleButtonsComponent extends React.Component {
    render() {
        const {contractViewStore} = this.props;
        return (
            <div>
                {contractViewStore.hasAuthorityAddContract &&
                <ContractAddButtonComponent/>
                }
            </div>
        )
    }
}

