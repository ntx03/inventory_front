import {ButtonsTitleProviderComponent} from 'component/provider/ButtonsTitleProviderComponent';
import {LayoutContent} from 'layout/LayoutContent';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {ErrorComponent} from '../base/ErrorComponent';
import {LoadingComponent} from '../base/LoadingComponent';
import {TableProviderComponent} from './TableProviderComponent';
import {ModalProviderComponent} from './ModalProviderComponent';

@inject('providerViewStore')
@observer
export class ProviderComponent extends React.Component {
    render() {
        const {providerViewStore} = this.props;
        if (providerViewStore.stateLoad.pending) {
            return <LoadingComponent/>
        }
        if (providerViewStore.stateLoad.errors) {
            return <ErrorComponent errors={providerViewStore.stateLoad.errors}/>
        }
        return (
            <LayoutContent title='Поставщики'
                           buttons={<ButtonsTitleProviderComponent/>}
            >
                <TableProviderComponent/>
                <ModalProviderComponent/>
            </LayoutContent>
        )
    }
}