import {Form, InputNumber, Select} from 'antd'
import {RenderSelectOption} from 'component/base/RenderSelectOptionOfList';
import {inject, observer} from 'mobx-react/index';
import React from 'react'
import {filterOption} from 'utils/filterOption';

@inject('consumablesViewStore')
@observer
export class FormChangeStateConsumablesComponent extends React.Component {
    render() {
        const {consumablesViewStore} = this.props;
        return (
            <Form>
                <Form.Item label="Состояние">
                    <Select value={consumablesViewStore.consumables.stateId}
                            onChange={this.handleConsumablesStateChange}
                            filterOption={filterOption}
                            showSearch
                            allowClear>
                        {RenderSelectOption.byName(consumablesViewStore.stateList)}
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

    handleConsumablesStateChange = value => {
        const {consumablesViewStore} = this.props;
        consumablesViewStore.setConsumablesStateId(value);
    };

    handleConsumablesCountChange = value => {
        const {consumablesViewStore} = this.props;
        consumablesViewStore.setConsumablesCount(value)
    };
}