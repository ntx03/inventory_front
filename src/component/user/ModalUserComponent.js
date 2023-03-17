import {Modal, Transfer, Tree} from 'antd'
import {RenderTreeNode} from 'component/base/RenderSelectOptionOfList';
import {toJS} from 'mobx';
import {inject, observer} from 'mobx-react/index';
import React from 'react'

@inject('userViewStore')
@observer
export class ModalEditGroupsUserComponent extends React.Component {
    render() {
        const {userViewStore} = this.props;
        return (
            <Modal
                title='Группы пользователя'
                visible={userViewStore.modal === 'EDIT_GROUPS'}
                onOk={this.handleOkClick}
                onCancel={this.handleCancelClick}
            >
                <Transfer dataSource={userViewStore.groupListToDataSource}
                          targetKeys={toJS(userViewStore.user.groupsId)}
                          onChange={this.handleGroupsIdUserChange}
                          render={item => item.name}/>
            </Modal>
        )
    }

    handleGroupsIdUserChange = targetKeys => {
        const {userViewStore} = this.props;
        userViewStore.setGroupsIdUser(targetKeys)
    };

    handleOkClick = () => {
        const {userViewStore} = this.props;
        userViewStore.handleSaveUserGroups()
    };

    handleCancelClick = () => {
        const {userViewStore} = this.props;
        userViewStore.hideModal();
    };
}

@inject('userViewStore')
@observer
export class ModalEditLocationsUserComponent extends React.Component {
    render() {
        const {userViewStore} = this.props;
        return (
            <Modal className={'user_locations'}
                   title='Местоположения пользователя'
                   visible={userViewStore.modal === 'EDIT_LOCATIONS'}
                   onOk={this.handleOkClick}
                   onCancel={this.handleCancelClick}>
                <Tree selectedKeys={toJS(userViewStore.user.locationsId)}
                      onSelect={this.handleSelectedChange}
                      defaultExpandAll
                      multiple>
                    {RenderTreeNode(userViewStore.treeLocationList)}
                </Tree>
            </Modal>
        )
    }

    handleSelectedChange = keys => {
        const {userViewStore} = this.props;
        userViewStore.setLocationsIdUser(keys);
    };

    handleOkClick = () => {
        const {userViewStore} = this.props;
        userViewStore.handleSaveUserLocationsId()
    };

    handleCancelClick = () => {
        const {userViewStore} = this.props;
        userViewStore.hideModal();
    };
}