import {ButtonsTitleLocationTagComponent} from 'component/locationTag/ButtonsTitleLocationTagComponent';
import {LayoutContent} from 'layout/LayoutContent';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {ErrorComponent} from '../base/ErrorComponent';
import {LoadingComponent} from '../base/LoadingComponent';
import {ModalLocationTagComponent} from './ModalLocationTagComponent';
import {TableLocationTagComponent} from './TableLocationTagComponent';

@inject('locationTagViewStore')
@observer
export class LocationTagComponent extends React.Component {
    render() {
        const {locationTagViewStore} = this.props;
        if (locationTagViewStore.stateLoad.pending) {
            return <LoadingComponent/>
        }
        if (locationTagViewStore.stateLoad.errors) {
            return <ErrorComponent errors={locationTagViewStore.stateLoad.errors}/>
        }
        return (
            <LayoutContent title='Теги местоположения'
                           buttons={<ButtonsTitleLocationTagComponent/>}>
                <TableLocationTagComponent/>
                <ModalLocationTagComponent/>
            </LayoutContent>
        )
    }
}