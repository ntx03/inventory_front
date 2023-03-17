import React from 'react';
import {Row} from 'antd';

export class LayoutContent extends React.Component {
    render() {
        const {title, buttons, className} = this.props;
        return [
            <Row key='layout_content_header'
                 className='layout_content_header'>
                <h1>
                    {title}
                </h1>
                {buttons}
            </Row>,
            <Row key='layout_content_content'
                 className='layout_content_content'>
                {this.props.children}
            </Row>
        ]
    }
}
