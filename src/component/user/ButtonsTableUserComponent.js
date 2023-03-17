import {Button} from 'antd'
import {inject, observer} from 'mobx-react';
import React from 'react';

@inject('userViewStore')
@observer
export class ButtonsTableUserComponent extends React.Component {
    render() {
        const {original, userViewStore} = this.props;
        return (
            <div className='table__buttons'>
                {userViewStore.hasAuthorityChangeUserRights &&
                <ButtonEditGroups user={original}/>
                }
                {userViewStore.hasAuthorityChangeUserRights &&
                <ButtonEditLocations user={original}/>
                }
            </div>
        );
    }
}

@inject('userViewStore')
@observer
class ButtonEditGroups extends React.Component {
    render() {
        return (
            <Button onClick={this.handleClick}
                    type="primary"
                    shape="circle"
                    ghost
                    icon="global"
                    title="Группы"/>
        )
    }

    handleClick = () => {
        const {userViewStore, user} = this.props;
        userViewStore.showEditUserGroups(user)
    };
}

@inject('userViewStore')
@observer
class ButtonEditLocations extends React.Component {
    render() {
        return (
            <Button onClick={this.handleClick}
                    type="dashed"
                    shape="circle"
                    icon="environment"
                    title="Местоположения"/>
        )
    }

    handleClick = () => {
        const {userViewStore, user} = this.props;
        userViewStore.showEditUserLocations(user)
    };
}