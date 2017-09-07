var webpack = require('webpack')
var config = require('./webpack.config.js');
var path = require('path');
var url = 'http://contempo.dev:9001';
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

process.env.NODE_ENV = 'development';

module.exports = Object.assign({}, config, {
    entry: [
        'webpack-dev-server/client?' + url, // Set up webpack dev server
        'webpack/hot/only-dev-server' // so we can use the browser refresh on changes
    ].concat(config.entry),
    devtool: 'cheap-eval', // best performance using original source while also showing useful error messages
    // devtool: 'source-map', // best performance using original source while also showing useful error messages
    output: Object.assign({}, config.output, {
        publicPath: url + '/'
    }),
    module: Object.assign({}, config.module, {
        loaders: config.module.loaders.slice(0, config.module.loaders.length-1).concat([ // assuming scss loaders are last, we use this loader instead so that HMR can update components when stylesheet changes during dev
            {
                test: /\.scss$/,
                loader: 'style!css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass?sourceMap!toolbox'
            }
        ]),
    }),
    plugins: config.plugins.slice(0,5).concat([
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development')
            },
            SHOW_INTERCOM: JSON.stringify(false)
        }),
        new BrowserSyncPlugin({
            host: 'contempo.dev',
            port: '9001',
            proxy: url
        }, {
            reload: false
        })]
    ),
    devServer: {
        contentBase: path.join(__dirname, '/app/static'),
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,
        stats: 'errors-only',
        host: url.match(/\/\/([\w.-]+)/)[1],
        port: url.match(/:(\d{4})\/?/)[1]
    }
});
