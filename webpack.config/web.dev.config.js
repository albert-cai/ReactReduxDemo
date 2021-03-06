var path = require('path');
var webpack = require('webpack');
var openBrowserPlugin = require('open-browser-webpack-plugin');
var htmlWebpackPlugin = require('html-webpack-plugin');
var htmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
var extractTextPlugin = require('extract-text-webpack-plugin');
var os = require('os');
var browser = os.platform().indexOf('win32') >= 0 ? 'chrome' : 'google chrome';

var myPlugins = [
    // new openBrowserPlugin({ url: 'http://localhost:8081', browser: browser }),
    new htmlWebpackPlugin({
        template: '!!raw-loader!index.ejs',
        inject: 'body',
        filename: 'index.ejs',
        alwaysWriteToDisk: true
    }),
    new htmlWebpackHarddiskPlugin(),
    new extractTextPlugin({
        filename: 'assets/css/[name].css',
    }),

    // pack all common packages from app & vendor and name it as verdor.[chunkhash].js.
    // Since we defined packages in vendor, so common packages are exactly the same as verndor.
    // then the packages in app will be moved out.

    // manifest is used to split runtime codes of webpack from vendor.js into manifest.js to make sure hash of vendor.js is not changed.
    new webpack.optimize.CommonsChunkPlugin({ names: ['vendor', 'manifest'] }),
    // new webpack.DefinePlugin({
    //     'process.env': {
    //         NODE_ENV: JSON.stringify('production')
    //     }
    // }),
    // new webpack.optimize.UglifyJsPlugin(),
    // hot-reload
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
];



module.exports = {
    entry: {
        app: ['./@app/index.js', 'webpack-hot-middleware/client?reload=true'],
        // vendor: ['webpack-hot-middleware/client?reload=true', 'jquery', 'react', 'react-dom',  'react-router', 'babel-polyfill']
        vendor: ['babel-polyfill', 'react', 'react-dom', 'react-router', 'react-router-dom', 'redux', 'react-redux', 'jquery', 'redux-saga']
    },

    output: {
        // chunk hash is to resolve browser cache issue.
        // e.g. javascript content is changed, but new change doesn't take effect, this is becuase browser caches javascript.
        // if we add a hash into filename, this is will be resolved since everytime you make any change, hash changes which means file name changes.
        path: path.resolve('./dist'),
        filename: 'assets/js/[name].js',
        chunkFilename: 'assets/js/[id].js',
        publicPath: '/'

        // deploy static files into server(IIS, CDN), then we need to set publicPath.
        // in below sample, they'er deployed to IIS.
        // publicPath: 'http://localhost/'
    },

    devtool: 'source-map',

    module: {
        rules: [{
            enforce: 'pre',
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'eslint-loader'
        },
        { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
        { test: /\.(png|woff|woff2|eot|ttf|svg|jpg|gif)$/, loader: ['url-loader', 'img-loader'] },
        { test: /\.html$/, loader: 'html-loader' },
        {
            test: /\.scss$/,
            use: extractTextPlugin.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader',
                    options: {
                        sourceMap: true,
                        modules: true
                    }
                },
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: true,
                        modules:true
                    }
                }
                ]
            })
        },
        {
            test: /\.css$/,
            use: extractTextPlugin.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader',
                    options: {
                        sourceMap: true,
                    }
                }]
            })
        }
        ]
    },

    plugins: myPlugins
}