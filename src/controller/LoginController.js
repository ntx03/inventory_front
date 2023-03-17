import React from 'react';
import {LoginComponent} from 'component/base/LoginComponent';
import {Col, Row} from 'antd';

export class LoginController {
    show() {
        return () => {
            return (
                <Row className='login'>
                    <Col xs={24} sm={18} md={12} lg={8} xl={5}>
                        <LoginComponent/>
                    </Col>
                </Row>
            )
        }
    }
}