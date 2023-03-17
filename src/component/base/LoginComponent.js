import React from 'react';
import {Button, Form, Icon, Input} from 'antd';
import {PENDING, REJECTED} from 'mobx-utils'
import {userInfoStore} from 'store/UserInfoStore';
import {inject, observer} from 'mobx-react/index';
import {LoadingComponent} from './LoadingComponent';
import {notification} from '../../utils/Notification';

class NormalLoginForm extends React.Component {
    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this._handleSubmit} className="login_form">
                <h1 className='login_form_title'>
                    Вход
                </h1>
                <Form.Item>
                    {getFieldDecorator('userName', {
                        rules: [
                            {required: true, message: 'Имя пользователя не может быть пустым'}
                        ],
                    })(
                        <Input prefix={<Icon type="user"/>}
                               placeholder="Имя пользователя"/>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [
                            {required: true, message: 'Пароль не может быть пустым'}
                        ],
                    })(
                        <Input prefix={<Icon type="lock"/>}
                               type="password"
                               placeholder="Пароль"/>
                    )}
                </Form.Item>
                <div className="login_form_button">
                    <Button type="primary" htmlType="submit">
                        Войти
                    </Button>
                </div>
            </Form>
        )
    }

    _handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                userInfoStore.logIn(values.userName, values.password);
            }
        });
    }
}

const LoginForm = Form.create()(NormalLoginForm);

@inject('controllerStore', 'userInfoStore')
@observer
export class LoginComponent extends React.Component {
    render() {
        const {userInfoStore} = this.props;
        if (userInfoStore.user.state === REJECTED) {
            notification.error(userInfoStore.user.value)
        }
        if (userInfoStore.user.state === PENDING) {
            return <LoadingComponent/>
        }
        return (
            <LoginForm/>
        )
    }
}