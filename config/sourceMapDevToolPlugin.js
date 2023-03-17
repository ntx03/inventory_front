import webpack from 'webpack';

export const sourceMapDevToolPlugin = new webpack.SourceMapDevToolPlugin({
    filename: '[file].map',
    exclude: /vendor/
});