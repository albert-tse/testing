var webpack = require('webpack');
var path = require('path');
var loaders = require('./webpack.loaders');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: [
        'font-awesome-webpack!./font-awesome.config.js',
        'bootstrap-loader/extractStyles',
        path.join(__dirname, 'app/scss/app.scss'), // Unique app stylesheet for webpack build
        path.join(__dirname, 'app/js/app.js') // App's entry point
    ],
    output: {
        path: path.join(__dirname, 'build/assets'),
        filename: 'bundle.js',
        publicPath: '/assets/'
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
    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin('styles.css'), // Extract all styles into one stylesheet
        new webpack.ProvidePlugin({
            //Add any global vars we want set
            $: 'jquery',
            jQuery: 'jquery',
            _: 'lodash',
            Promise: 'bluebird',
            Auth0: 'auth0-js'
        }),
        new HTMLWebpackPlugin({
            //This plugin is used to cache break the files
            template: path.join(__dirname, 'app/index.html'),
            hash: true
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
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
