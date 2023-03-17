import React from 'react'
import {Form, Input, Modal} from 'antd'
import {inject, observer} from 'mobx-react/index';

@inject('providerViewStore')
@observer
export class ModalProviderComponent extends React.Component {
    render() {
        const {providerViewStore} = this.props;
        const provider = providerViewStore.provider;
        return (
            <Modal
                title={provider.id && 'Редактировать' || 'Добавить'}
                visible={providerViewStore.modal === 'EDIT'}
                onOk={() => providerViewStore.handleSaveProvider()}
                onCancel={() => providerViewStore.hideModal()}
            >
                <Form>
                    <Form.Item label="Наименование"
                    >
                        <Input value={provider.name}
                               onChange={this.handleProviderNameChange}/>
                    </Form.Item>
                    <Form.Item label="Комментарий"
                    >
                        <Input.TextArea value={provider.comment}
                               onChange={this.handleProviderCommentChange}/>
                    </Form.Item>
                </Form>
            </Modal>
        )
    }

    handleProviderNameChange = e => {
        const {providerViewStore} = this.props;
        providerViewStore.setProviderName(e.target.value)
    };

    handleProviderCommentChange = e => {
        const {providerViewStore} = this.props;
        providerViewStore.setProviderComment(e.target.value)
    };
}