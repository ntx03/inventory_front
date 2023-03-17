import {Form, InputNumber, Select} from 'antd'
import {ErrorComponent} from 'component/base/ErrorComponent';
import {LoadingComponent} from 'component/base/LoadingComponent';
import {inject, observer} from 'mobx-react/index';
import React from 'react'
import {filterOption} from 'utils/filterOption';

@inject('consumablesViewStore')
@observer
export class FormEditConsignmentConsumablesComponent extends React.Component {
    render() {
        const {consumablesViewStore} = this.props;
        if (consumablesViewStore.stateLoadConsignmentCreatedList.pending) {
            return <LoadingComponent/>
        }
        if (consumablesViewStore.stateLoadConsignmentCreatedList.errors) {
            return <ErrorComponent errors={consumablesViewStore.stateLoadConsignmentCreatedList.errors}/>
        }
        const RenderSelectOption = () => {
            const locationIdToLocationMap = consumablesViewStore.locationIdToLocationMap;

            return consumablesViewStore.consignmentCreatedList.map(item => {
                const sourceLocation = this.getFullNameLocation(locationIdToLocationMap.get(item.sourceLocationId), []);
                const destinationLocation = this.getFullNameLocation(locationIdToLocationMap.get(item.destinationLocationId), []);

                const sender = item.sender.name;
                const recipient = item.recipient.name;

                const title = `${item.number} ${sender} ${sourceLocation} -> ${recipient} ${destinationLocation}`;
                return <Select.Option key={item.id} title={title}>{title}</Select.Option>
            })
        };
        return (
            <Form>
                <Form.Item label="Накладная">
                    <Select value={consumablesViewStore.consumables.consignmentId}
                        onChange={this.handleConsumablesConsignmentChange}
                            filterOption={filterOption}
                            showSearch
                            allowClear>
                        {RenderSelectOption()}
                    </Select>
                </Form.Item>
                <Form.Item label="Кол-во">
                    <InputNumber value={consumablesViewStore.consumables.count}
                                 onChange={this.handleConsumablesCountChange}
                                 min={0}/>
                </Form.Item>
            </Form>
        )
    }

    handleConsumablesConsignmentChange = value => {
        const {consumablesViewStore} = this.props;
        consumablesViewStore.setConsumablesConsignmentId(value);
    };

    handleConsumablesCountChange = value => {
        const {consumablesViewStore} = this.props;
        consumablesViewStore.setConsumablesCount(value)
    };

    getFullNameLocation = (location, fullLocationList) => {
        const {consumablesViewStore} = this.props;

        if (location == null) {
            return fullLocationList.join(" / ");
        }
        fullLocationList.push(location.name);

        const parent = consumablesViewStore.locationIdToLocationMap.get(location.parentId);
        return this.getFullNameLocation(parent, fullLocationList)
    };
}