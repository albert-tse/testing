var config = require('./webpack.config.js');
var path = require('path');

process.env.NODE_ENV = 'production';

module.exports = Object.assign({}, config, {
    context: __dirname,
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'bundle.js',
        publicPath: '',
        sourceMapFilename: "[file].map"
    }
});
