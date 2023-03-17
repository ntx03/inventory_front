import {LocaleProvider} from 'antd';
import 'antd/dist/antd.css';
import localeRU from 'antd/lib/locale-provider/ru_RU';
import {inject, observer, Provider} from 'mobx-react';
import 'moment/locale/ru';
import React from 'react';
import ReactDom from 'react-dom';
import 'react-table/react-table.css';
import 'style/index.scss';
import {ControllerStore} from './store/ControllerStore';
import {userInfoStore} from './store/UserInfoStore';
import 'config'

const stores = {
    controllerStore: new ControllerStore(),
    userInfoStore
};

@inject('controllerStore')
@observer
class Application extends React.Component {
    render() {
        const {controllerStore} = this.props;
        return controllerStore.renderFunction()
    }
}

ReactDom.render(
    <Provider {...stores}>
        <LocaleProvider locale={localeRU}>
            <Application/>
        </LocaleProvider>
    </Provider>,
    document.getElementById('app')
);


