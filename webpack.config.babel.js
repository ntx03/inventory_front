import path from 'path';
import {commonsChunkPlugin} from './config/commonsChunkPlugin';
import {extractTextPlugin} from './config/extractTextPlugin';
import {htmlPlugin} from './config/htmlWebpackPlugin';
import {sourceMapDevToolPlugin} from './config/sourceMapDevToolPlugin';
import {uglifyJsPlugin} from './config/uglifyJsPlugin';

const isDevServer = path.basename(require.main.filename) === 'webpack-dev-server.js';

const config = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        main: ['index.js']
    },
    output: {
        filename: 'js/[name].js'
    },
    module: {
        rules: [{
            test: /.jsx?$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        }, {
            test: /\.(png|jpg|gif|svg)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: 'img/[name].[ext]',
                    publicPath: '/'
                }
            }]
        }, {
            test: /\.scss$/,
            use: extractTextPlugin.extract([{
                loader: 'css-loader',
                options: {
                    minimize: true,
                    sourceMap: isDevServer
                }
            }, {
                loader: 'sass-loader'
            }])
        }, {
            test: /\.css$/,
            use: extractTextPlugin.extract([{
                loader: 'css-loader',
                options: {
                    minimize: true,
                    sourceMap: isDevServer
                }
            }])
        }, {
            test: /\.html$/,
            use: {
                loader: 'html-loader',
                options: {
                    minimize: true
                }
            }
        }]
    },
    resolve: {
        modules: ['node_modules', './src']
    },
    plugins: [
        commonsChunkPlugin,
        extractTextPlugin,
        htmlPlugin
    ],
    devServer: {
        contentBase: false,
        inline: false,
        proxy: {
            '/api': 'http://server:8080/'
        },
        compress: true,
        host: '0.0.0.0',
        port: 9000
    }
};

if (isDevServer) {
    const main = ['dev.js'];
    config.entry.main.push(...main);
    config.plugins.push(sourceMapDevToolPlugin);
} else {
    config.output = {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].min.js'
    };
    config.plugins.push(uglifyJsPlugin);
}

export default config;