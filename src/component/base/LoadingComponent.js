import React from 'react'
import {Spin} from 'antd'

export class LoadingComponent extends React.Component {
    render() {
        return (
            <div className='loading'>
                <Spin/>
            </div>
        )
    }
}