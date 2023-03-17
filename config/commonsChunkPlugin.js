import webpack from 'webpack';

export const commonsChunkPlugin = new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: function (module) {
        return module.context && module.context.includes('node_modules');
    }
});