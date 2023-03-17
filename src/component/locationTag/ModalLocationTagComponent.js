import {Form, Input, Modal} from 'antd'
import {inject, observer} from 'mobx-react/index';
import React from 'react'

@inject('locationTagViewStore')
@observer
export class ModalLocationTagComponent extends React.Component {
    render() {
        const {locationTagViewStore} = this.props;
        return (
            <Modal title={locationTagViewStore.locationTag.id && 'Редактировать' || 'Добавить'}
                   visible={locationTagViewStore.modal === 'EDIT'}
                   onOk={this.handleOkClick}
                   onCancel={this.handleCancelClick}>
                <Form>
                    <Form.Item label="Наименование"
                    >
                        <Input value={locationTagViewStore.locationTag.name}
                               onChange={this.handleNameChange}/>
                    </Form.Item>
                </Form>
            </Modal>
        )
    }

    handleNameChange = e => {
        const {locationTagViewStore} = this.props;
        locationTagViewStore.setLocationTagName(e.target.value)
    };

    handleOkClick = () => {
        const {locationTagViewStore} = this.props;
        locationTagViewStore.handleSaveLocationTag()
    };

    handleCancelClick = () => {
        const {locationTagViewStore} = this.props;
        locationTagViewStore.hideModal()
    };
}