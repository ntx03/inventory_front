import {DatePicker, Form, Input, Select} from 'antd'
import {RenderSelectOption} from 'component/base/RenderSelectOptionOfList';
import {inject, observer} from 'mobx-react/index';
import React from 'react'
import {filterOption} from 'utils/filterOption';

@inject('contractViewStore')
@observer
export class ContractEditingFormComponent extends React.Component {
    render() {
        const {contractViewStore} = this.props;
        return (
            <Form>
                <Form.Item label="Поставщик">
                    <Select value={contractViewStore.contract.providerId}
                            onChange={this.handleContractProviderIdChange}
                            filterOption={filterOption}
                            showSearch>
                        {RenderSelectOption.byName(contractViewStore.providerList)}
                    </Select>
                </Form.Item>
                <Form.Item label="Номер">
                    <Input value={contractViewStore.contract.number}
                           onChange={this.handleContractNumberChange}/>
                </Form.Item>
                <Form.Item label="Дата">
                    <DatePicker value={contractViewStore.contract.date}
                                onChange={this.handleContractDateChange}/>
                </Form.Item>
            </Form>
        )
    }

    handleContractProviderIdChange = id => {
        const {contractViewStore} = this.props;
        contractViewStore.setContractProviderId(id)
    };

    handleContractNumberChange = e => {
        const {contractViewStore} = this.props;
        contractViewStore.setContractNumber(e.target.value)
    };

    handleContractDateChange = date => {
        const {contractViewStore} = this.props;
        contractViewStore.setContractDate(date)
    };
}