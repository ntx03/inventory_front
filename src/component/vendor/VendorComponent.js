import {ButtonsTitleVendorComponent} from 'component/vendor/ButtonsTitleVendorComponent';
import {LayoutContent} from 'layout/LayoutContent';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {ErrorComponent} from '../base/ErrorComponent';
import {LoadingComponent} from '../base/LoadingComponent';
import {TableVendorComponent} from './TableVendorComponent';
import {ModalVendorComponent} from './ModalVendorComponent';

@inject('vendorViewStore')
@observer
export class VendorComponent extends React.Component {
    render() {
        const {vendorViewStore} = this.props;
        if (vendorViewStore.stateLoad.pending) {
            return <LoadingComponent/>
        }
        if (vendorViewStore.stateLoad.errors) {
            return <ErrorComponent errors={vendorViewStore.stateLoad.errors}/>
        }
        return (
            <LayoutContent title='Производители'
                           buttons={<ButtonsTitleVendorComponent/>}
            >
                <TableVendorComponent/>
                <ModalVendorComponent/>
            </LayoutContent>
        )
    }
}