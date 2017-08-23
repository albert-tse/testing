var webpack = require('webpack');
var config = require('./webpack.config.js');
var path = require('path');

process.env.NODE_ENV = 'staging';

module.exports = Object.assign({}, config, {
    plugins: plugins.slice(0, 5).concat([
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('staging')
            },
            SHOW_INTERCOM: JSON.stringify(true)
        })
    ])
});
