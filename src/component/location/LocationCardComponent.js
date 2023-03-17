import {Card} from 'antd';
import {LocationCopyButtonComponent} from 'component/location/buttons/LocationCopyButtonComponent';
import {LocationEditingFromComponent} from 'component/location/forms/LocationEditingFromComponent';
import {inject, observer} from 'mobx-react';
import React from 'react';

@inject('locationViewStore')
@observer
export class LocationCardComponent extends React.Component {
    render() {
        const {locationViewStore} = this.props;
        return (
            <Card title={locationViewStore.showAdd ? 'Добавить местоположение' : 'Редактор местоположения'}
                  extra={!locationViewStore.showAdd && <LocationCopyButtonComponent/>}>
                <LocationEditingFromComponent/>
            </Card>
        )
    }
}