import UglifyJsPlugin from 'uglifyjs-webpack-plugin';

export const uglifyJsPlugin = new UglifyJsPlugin({
    sourceMap: true
});