import {createRouter} from 'router5';
import loggerPlugin from 'router5/plugins/logger';
import browserPlugin from 'router5/plugins/browser';
import routes from 'routes';
import {mobxPlugin, RouterStore} from 'mobx-router5';

const routerStore = new RouterStore();

function configureRouter(useLoggerPlugin = false) {
    const options = {
        defaultRoute: 'equipment'
    };

    const router = createRouter(routes, options)
        .usePlugin(mobxPlugin(routerStore))
        .usePlugin(browserPlugin({useHash: true}));

    if (useLoggerPlugin) {
        router.usePlugin(loggerPlugin);
    }

    return router;
}

const router = configureRouter(true);
router.start();

export {
    routerStore
};