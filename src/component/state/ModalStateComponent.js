import React from 'react'
import {Form, Input, Modal} from 'antd'
import {inject, observer} from 'mobx-react/index';

@inject('stateViewStore')
@observer
export class ModalStateComponent extends React.Component {
    render() {
        const {stateViewStore} = this.props;
        const state = stateViewStore.state;
        return (
            <Modal
                title={state.id && 'Редактировать' || 'Добавить'}
                visible={stateViewStore.modal === 'EDIT'}
                onOk={() => stateViewStore.handleSaveState()}
                onCancel={() => stateViewStore.hideModal()}
            >
                <Form>
                    <Form.Item label="Наименование"
                    >
                        <Input value={state.name}
                               onChange={this.handleNameChange}/>
                    </Form.Item>
                </Form>
            </Modal>
        )
    }

    handleNameChange = e => {
        const {stateViewStore} = this.props;
        stateViewStore.setStateName(e.target.value)
    };
}