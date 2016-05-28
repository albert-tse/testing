var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = [
    {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'react-hot!babel'
    },
    {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file'
    },
    {
        test: /\.(woff|woff2)$/,
        loader: 'url?prefix=font&limit=5000'
    },
    {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream'
    },
    {
        test: /\.svg(\?\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=image/svg+xml'
    },
    {
        test: /\.gif$/,
        loader: 'url?limit=10000&mimetype=image/gif'
    },
    {
        test: /\.jpg$/,
        loader: 'url?limit=10000&mimetype=image/jpg'
    },
    {
        test: /\.png$/,
        loader: 'url?limit=10000&mimetype=image/png'
    },
    {
        test: /\.html$/,
        loader: 'html'
    },
    {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass?sourceMap')
    }
];
