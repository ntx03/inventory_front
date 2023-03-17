import React from 'react';
import {Button, Layout} from 'antd';
import {MenuComponent} from 'layout/MenuComponent'
import {inject, observer, Provider} from 'mobx-react';
import {modalStore} from '../store/ModalStore';

@inject('userInfoStore')
@observer
export class LayoutComponent extends React.Component {
    render() {
        const {userInfoStore} = this.props;
        const user = userInfoStore.user.value;
        return (
            <Provider modalStore={modalStore}>
                <Layout className='layout'>
                    <Layout.Header className='layout_header'>
                        <div className='layout_header_logo'/>
                        <MenuComponent className='menu'/>
                        <div className='layout_header_user-info'>
                        <span>
                            {user.details.name}
                        </span>
                            <Button shape="circle"
                                    icon="logout"
                                    ghost
                                    onClick={this._handleLogout}
                            />
                        </div>
                    </Layout.Header>
                    <Layout>
                        <Layout.Content className='layout_content'>
                            {this.props.children}
                        </Layout.Content>
                    </Layout>
                </Layout>
            </Provider>
        )
    }

    _handleLogout = () => {
        const {userInfoStore} = this.props;
        userInfoStore.logOut()
    }
}