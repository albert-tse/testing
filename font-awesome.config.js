var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    styleLoader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader'),
    styles: {
        'mixins': true,
        'bordered-pulled': true,
        'core': true,
        'fixed-width': true,
        'icons': true,
        'larger': true,
        'list': true,
        'path': true,
        'rotated-flipped': true,
        'animated': true,
        'stacked': true
    }
};
