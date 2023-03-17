import {LocationAddButtonComponent} from 'component/location/buttons/LocationAddButtonComponent';
import {LocationDeleteButtonComponent} from 'component/location/buttons/LocationDeleteButtonComponent';
import {LocationInsertButtonComponent} from 'component/location/buttons/LocationInsertButtonComponent';
import {inject, observer} from 'mobx-react';
import React from 'react';

@inject('locationViewStore')
@observer
export class LocationTreeButtonsComponent extends React.Component {
    render() {
        const {locationViewStore} = this.props;
        return (
            <div className='buttons'>
                {locationViewStore.hasAuthorityAddLocation &&
                <LocationAddButtonComponent/>
                }
                {locationViewStore.hasAuthorityAddLocation &&
                locationViewStore.templateLocation &&
                <LocationInsertButtonComponent/>
                }
                {locationViewStore.hasAuthorityDeleteLocation &&
                <LocationDeleteButtonComponent/>
                }
            </div>
        );
    }
}