import React from 'react'

export class MaxSizeFlex extends React.Component {
    render() {
        return (
            <div className="maxSizeFlex__container">
                <div className="maxSizeFlex__content">
                    {this.props.children}
                </div>
            </div>
        )
    }
}