import ExtractTextPlugin from 'extract-text-webpack-plugin';

export const extractTextPlugin = new ExtractTextPlugin({
    filename:'css/[name].min.css',
    allChunks: true
});
