import {Button, Form, Input, Select} from 'antd';
import {RenderSelectOption} from 'component/base/RenderSelectOptionOfList';
import {toJS} from 'mobx';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {filterOption} from 'utils/filterOption';

@inject('locationViewStore')
@observer
export class LocationEditingFromComponent extends React.Component {
    render() {
        const {locationViewStore} = this.props;
        const disabled = !locationViewStore.hasAuthorityEditLocation;
        const RenderLocationTypeOption = (locationTypeList) => {
            return locationTypeList.map(locationType => {
                const locationTypeName = locationViewStore.locationTypeToLocationTypeNameMap.get(locationType);
                return <Select.Option key={locationType} title={locationTypeName}>{locationTypeName}</Select.Option>
            })
        };
        return (
            <Form>
                <Form.Item label="Наименование">
                    <Input disabled={disabled}
                           value={locationViewStore.currentLocation.name}
                           onChange={this.handleLocationNameChange}/>
                </Form.Item>
                <Form.Item label="Адрес">
                    <Input disabled={disabled}
                           value={locationViewStore.currentLocation.address}
                           onChange={this.handleLocationAddressChange}/>
                </Form.Item>
                <Form.Item label="Описание">
                    <Input.TextArea disabled={disabled}
                                    autosize
                                    value={locationViewStore.currentLocation.description}
                                    onChange={this.handleLocationDescriptionChange}/>
                </Form.Item>
                <Form.Item label="Тип">
                    <Select disabled={disabled}
                            value={locationViewStore.currentLocation.type}
                            onChange={this.handleLocationTypeChange}
                            showSearch
                            filterOption={filterOption}>
                        {RenderLocationTypeOption(locationViewStore.locationTypeList)}
                    </Select>
                </Form.Item>
                <Form.Item label="Теги">
                    <Select disabled={disabled}
                            showSearch
                            filterOption={filterOption}
                            mode="multiple"
                            value={toJS(locationViewStore.currentLocation.tagsId)}
                            onChange={this.handleLocationTagsChange}>
                        {RenderSelectOption.byName(locationViewStore.locationTagList)}
                    </Select>
                </Form.Item>
                <div style={{textAlign: 'center'}}>
                    {locationViewStore.locationChange &&
                    <Button type='primary'
                            onClick={this.handleSaveClick}>
                        Сохранить
                    </Button>
                    }
                    {locationViewStore.showAdd &&
                    <Button onClick={this.handleCancelClick}>
                        Отмена
                    </Button>
                    }
                </div>
            </Form>
        )
    }

    handleLocationNameChange = e => {
        const {locationViewStore} = this.props;
        locationViewStore.setCurrentLocationName(e.target.value)
    };

    handleLocationAddressChange = e => {
        const {locationViewStore} = this.props;
        locationViewStore.setCurrentLocationAddress(e.target.value)
    };

    handleLocationDescriptionChange = e => {
        const {locationViewStore} = this.props;
        locationViewStore.setCurrentLocationDescription(e.target.value)
    };

    handleLocationTypeChange = key => {
        const {locationViewStore} = this.props;
        locationViewStore.setCurrentLocationType(key);
    };

    handleLocationTagsChange = keyList => {
        const {locationViewStore} = this.props;
        locationViewStore.setCurrentLocationTags(keyList);
    };

    handleSaveClick = () => {
        const {locationViewStore} = this.props;
        locationViewStore.handleSaveLocation();
    };

    handleCancelClick = () => {
        const {locationViewStore} = this.props;
        locationViewStore.handleCancelSaveLocation();
    };
}
