var config = require('./webpack.config.js');
var path = require('path');

process.env.NODE_ENV = 'production';

module.exports = Object.assign({}, config, {});
