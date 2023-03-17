import {Button, Input, InputNumber, Popconfirm} from 'antd'
import {inject, observer} from 'mobx-react';
import React from 'react';

@observer
export class ButtonsTableConsumablesSendComponent extends React.Component {
    render() {
        const {original} = this.props;
        return (
            <ButtonRemove consumables={original}/>
        );
    }
}

@inject('consignmentViewStore')
@observer
class ButtonRemove extends React.Component {
    state = {
        count: 0
    };
    render() {
        const {consumables} = this.props;
        return (
            <Input.Group compact>
                <Popconfirm placement="left"
                            title={'Вы точно хотите убрать из накладной?'}
                            okText="Да"
                            cancelText="Нет"
                            onConfirm={this.handleClick}>
                    <Button type="danger"
                            icon="minus-circle"/>
                </Popconfirm>
                <InputNumber style={{width: '60%'}}
                             value={this.state.count}
                             max={consumables.count}
                             min={1}
                             onChange={this.handleCountChange}/>
            </Input.Group>

        )
    }

    componentDidMount() {
        const {consumables} = this.props;
        this.setState({
            consumablesId: consumables.id,
            count: consumables.count
        })
    }

    handleCountChange = value => {
        this.setState({
            count: value
        });
    };


    handleClick = () => {
        const {consignmentViewStore} = this.props;
        consignmentViewStore.handleRemoveConsumables(this.state);
    };
}