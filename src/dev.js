import React from 'react';
import DevTools, {configureDevtool} from 'mobx-react-devtools';
import ReactDom from 'react-dom';

const script = () => {
    const element = document.createElement('script');
    element.type = 'text/javascript';
    element.src = '/webpack-dev-server.js';
    return element
};

const devTool = () => {
    const element = document.createElement('div');
    element.id = 'devTool';
    return element
};

document.head.appendChild(script());
document.body.appendChild(devTool());

configureDevtool({
    logEnabled: false,
    updatesEnabled: false
});

ReactDom.render(
    <DevTools/>,
    document.getElementById('devTool')
);