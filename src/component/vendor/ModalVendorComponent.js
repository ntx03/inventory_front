import React from 'react'
import {Form, Input, Modal} from 'antd'
import {inject, observer} from 'mobx-react/index';

@inject('vendorViewStore')
@observer
export class ModalVendorComponent extends React.Component {
    render() {
        const {vendorViewStore} = this.props;
        const vendor = vendorViewStore.vendor;
        return (
            <Modal
                title={vendor.id && 'Редактировать' || 'Добавить'}
                visible={vendorViewStore.modal === 'EDIT'}
                onOk={() => vendorViewStore.handleSaveVendor()}
                onCancel={() => vendorViewStore.hideModal()}
            >
                <Form>
                    <Form.Item label="Наименование"
                    >
                        <Input value={vendor.name}
                               onChange={this.handleNameChange}/>
                    </Form.Item>
                </Form>
            </Modal>
        )
    }

    handleNameChange = e => {
        const {vendorViewStore} = this.props;
        vendorViewStore.setVendorName(e.target.value)
    };
}