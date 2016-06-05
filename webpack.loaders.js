var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = [
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
        loader: 'url?limit=10000'
    },
    {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass!toolbox')
    }
];
