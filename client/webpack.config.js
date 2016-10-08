/**
 * Created by guoq on 16/10/2.
 */
var webpack = require('webpack'),
    minimize = process.argv.indexOf('--no-minimize') === -1 ? true : false,
    plugins = [];

minimize && plugins.push(new webpack.optimize.UglifyJsPlugin());

module.exports = {
    entry: './app-client.js',
    output: {
        filename: 'bundle.js',
        path: './public'
    },
    plugins: plugins,
    module: {
        loaders: [{
            exclude: /(node_modules|app-server.js)/,
            loader: 'babel',
            query: {
                presets: ['es2015', 'react']
            }
        }, { test: /\.css$/, loader: "style!css" },
            {
                test: /\.(jpg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
                loader: 'file',
                query: {
                    name: 'static/media/[name].[hash:8].[ext]'
                }
            }
        ]
    },

};