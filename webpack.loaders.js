var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');

module.exports = [
    {
        test: /config\/index.js$/,
        loader: path.join(__dirname, '/config-loader.js')
    },
    {
        test: /node_modules[\\\/]auth0-lock[\\\/].*\.js$/,
        loaders: [
            'transform-loader/cacheable?brfs',
            'transform-loader/cacheable?packageify'
        ]
    }, {
        test: /node_modules[\\\/]auth0-lock[\\\/].*\.ejs$/,
        loader: 'transform-loader/cacheable?ejsify'
    }, {
        test: /node_modules[\\\/]nvd3[\\\/].*\.css$/,
        loader: "style-loader!css-loader"
    }, {
        test: /\.json$/,
        loader: 'json-loader'
    },
    {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'react-hot!babel'
    },
    {
        test: /\.html$/,
        loader: 'html'
    },
    {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file'
    },
    {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?prefix=font&limit=5000&mimetype=application/font-woff'
    },
    {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream'
    },
    {
        test: /\.(svg|gif|jpg|png)(\?(v=)?\d+\.\d+\.\d+)?$/,
        loader: 'file'
    },
    {
        test: /bootstrap-sass\/assets\/javascripts\//,
        loader: 'imports?jQuery=jquery'
    },
    {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass!toolbox')
    }
];
