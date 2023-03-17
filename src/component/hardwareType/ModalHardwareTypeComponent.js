import React from 'react'
import {Form, Input, Modal} from 'antd'
import {inject, observer} from 'mobx-react/index';

@inject('hardwareTypeViewStore')
@observer
export class ModalHardwareTypeComponent extends React.Component {
    render() {
        const {hardwareTypeViewStore} = this.props;
        const hardwareType = hardwareTypeViewStore.hardwareType;
        return (
            <Modal
                title={hardwareType.id && 'Редактировать' || 'Добавить'}
                visible={hardwareTypeViewStore.modal === 'EDIT'}
                onOk={() => hardwareTypeViewStore.handleSaveHardwareType()}
                onCancel={() => hardwareTypeViewStore.hideModal()}
            >
                <Form>
                    <Form.Item label="Наименование"
                    >
                        <Input value={hardwareType.name}
                               onChange={this.handleHardwareTypeNameChange}/>
                    </Form.Item>
                </Form>
            </Modal>
        )
    }

    handleHardwareTypeNameChange = e => {
        const {hardwareTypeViewStore} = this.props;
        hardwareTypeViewStore.setHardwareTypeName(e.target.value)
    };
}