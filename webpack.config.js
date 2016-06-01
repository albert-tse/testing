var webpack = require('webpack');
var path = require('path');
var loaders = require('./webpack.loaders');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: [
        'webpack-dev-server/client?http://contempo.dev:9000', // Set up webpack dev server
        'webpack/hot/only-dev-server', // so we can use the browser refresh on changes
        'font-awesome-webpack',
        path.join(__dirname, 'app/scss/app.webpack'), // Unique app stylesheet for webpack build
        path.join(__dirname, 'app/js/app.js') // App's entry point
    ],
    devtool: process.env.WEBPACK_DEVTOOL || 'source-map',
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js',
        publicPath: 'http://contempo.dev:9000/'
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.scss' ] // added '' because we omit extension in our import statements
    },
    module: {
        loaders: loaders
    },
    toolbox: {
        theme: path.join(__dirname, 'app/scss/theme.scss')
    },
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,
        stats: 'errors-only',
        host: 'contempo.dev',
        port: 9000
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        // new ExtractTextPlugin('styles.css'), Only extract in production
        new HTMLWebpackPlugin({
            template: path.join(__dirname, 'app/index.template.html')
        })
    ],
    node: {
        fs: "empty" // when trying to import module 'fs' webpack returns an error
    },
    externals: [
        {
            './cptable': 'var cptable' // refer to this issue thread for more details: https://github.com/SheetJS/js-xlsx/issues/285
        }
    ]
};
