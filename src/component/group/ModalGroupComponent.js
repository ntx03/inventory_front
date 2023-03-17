import {Form, Input, Modal, Transfer} from 'antd'
import {toJS} from 'mobx';
import {inject, observer} from 'mobx-react/index';
import React from 'react'

@inject('groupViewStore')
@observer
export class ModalGroupComponent extends React.Component {
    render() {
        const {groupViewStore} = this.props;
        const group = groupViewStore.group;
        return (
            <Modal className='edit_group'
                   title={group.id && 'Редактировать' || 'Добавить'}
                   visible={groupViewStore.modal === 'EDIT'}
                   onOk={() => groupViewStore.handleSaveGroup()}
                   onCancel={() => groupViewStore.hideModal()}>
                <Form>
                    <Form.Item label="Наименование">
                        <Input value={group.name}
                               onChange={this.handleNameChange}/>
                    </Form.Item>
                    <Form.Item label="Роли">
                        <Transfer dataSource={groupViewStore.authorityListToDataSource}
                                  targetKeys={toJS(groupViewStore.group.authorities)}
                                  onChange={this.handleAuthorityChange}
                                  render={item => item.key}
                                  titles={['Все роли', 'Роли группы']}/>
                    </Form.Item>
                </Form>
            </Modal>
        )
    }

    handleNameChange = e => {
        const {groupViewStore} = this.props;
        groupViewStore.setGroupName(e.target.value)
    };

    handleAuthorityChange = targetKeys => {
        const {groupViewStore} = this.props;
        groupViewStore.setAuthoritiesGroup(targetKeys);
    }
}