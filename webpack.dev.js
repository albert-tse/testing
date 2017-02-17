var config = require('./webpack.config.js');
var path = require('path');

process.env.NODE_ENV = 'dev';

module.exports = Object.assign({}, config, {});