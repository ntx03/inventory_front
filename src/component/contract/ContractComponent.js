import {ContractTitleButtonsComponent} from 'component/contract/ContractTitleButtonsComponent';
import {LayoutContent} from 'layout/LayoutContent';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {ErrorComponent} from '../base/ErrorComponent';
import {LoadingComponent} from '../base/LoadingComponent';
import {ContractEditingModalComponent} from './ContractEditModalComponent';
import {ContractTableComponent} from './ContractTableComponent';

@inject('contractViewStore')
@observer
export class ContractComponent extends React.Component {
    render() {
        const {contractViewStore} = this.props;
        if (contractViewStore.stateLoad.pending) {
            return <LoadingComponent/>
        }
        if (contractViewStore.stateLoad.errors) {
            return <ErrorComponent errors={contractViewStore.stateLoad.errors}/>
        }
        return (
            <LayoutContent title='Договоры'
                           buttons={<ContractTitleButtonsComponent/>}>
                <ContractTableComponent/>
                <ContractEditingModalComponent/>
            </LayoutContent>
        )
    }
}