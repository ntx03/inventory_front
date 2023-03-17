import {ContractEditButtonComponent} from 'component/contract/buttons/ContractEditButtonComponent';
import {ContractDeleteButtonComponent} from 'component/contract/buttons/ContractDeleteButtonComponent';
import {inject, observer} from 'mobx-react';
import React from 'react';

@inject('contractViewStore')
@observer
export class ContractTableButtonsComponent extends React.Component {
    render() {
        const {original, contractViewStore} = this.props;
        return (
            <div className='table__buttons'>
                {contractViewStore.hasAuthorityEditContract &&
                <ContractEditButtonComponent contract={original}/>
                }
                {contractViewStore.hasAuthorityDeleteContract &&
                <ContractDeleteButtonComponent contract={original}/>
                }
            </div>
        );
    }
}