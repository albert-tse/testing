var config = require('./webpack.config.js');
var path = require('path');
var url = 'http://contempo.dev:9000';

module.exports = Object.assign({}, config, {
    entry: [
        'webpack-dev-server/client?' + url, // Set up webpack dev server
        'webpack/hot/only-dev-server' // so we can use the browser refresh on changes
    ].concat(config.entry),
    devtool: 'source-map',
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
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,
        stats: 'errors-only',
        host: url.match(/\/\/([\w.-]+)/)[1],
        port: url.match(/:(\d{4})\/?/)[1]
    }
});