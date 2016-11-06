/**
 * Created by guoq on 16/10/2.
 */
var path = require('path');

var webpack = require('webpack'),
    minimize = process.argv.indexOf('--no-minimize') === -1 ? true : false,
    plugins = [];

const inDev = process.env.NODE_ENV !== 'production';


if (inDev) {
    plugins.push(
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    );
}
else {
    //plugins.push(
    //    new webpack.optimize.UglifyJsPlugin());
}

module.exports = {
    entry: './app-client.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, '/public')
    },
    plugins: plugins,

    module: {
        loaders: [{
            exclude: /(node_modules|app-server.js)/,
            loader: inDev ? 'react-hot!babel' : 'babel',

        }, { test: /\.css$/, loader: "style!css" },
            {
                test: /\.(jpg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp3)(\?.*)?$/,
                loader: 'file',
                query: {
                    name: 'static/media/[name].[hash:8].[ext]'
                }
            }
        ]
    },

};
