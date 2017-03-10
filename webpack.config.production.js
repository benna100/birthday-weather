var HtmlWebpackPlugin = require('html-webpack-plugin');
var UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
var path = require("path");

module.exports = {
    entry: {
        main: './src/js/app.jsx',
        /*
        vendor: ["jquery", "underscore"],
        */
    },
    devtool: process.env.WEBPACK_DEVTOOL || 'eval-source-map',
    output: {
        path: path.join(__dirname, "dist"),
        filename: 'bundle.[hash].min.js'
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                plugins: ['transform-runtime'],
                presets: ['es2015', 'react']
            }
        }, {
            test: /\.hbs$/,
            loader: 'handlebars'
        }, {
            test: /\.css$/,
            loaders: ['style-loader', 'css-loader?importLoaders=1', 'postcss-loader'],
            exclude: ['node_modules']
        }, {
            test: /\.scss$/,
            loaders: ['style-loader', 'css-loader?importLoaders=1', 'sass-loader'],
            exclude: ['node_modules']
        }, {
            test: /\.json$/,
            loader: 'json-loader'
        }, {
            test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
            exclude: /(node_modules|bower_components)/,
            loader: "file-loader"
        }, {
            test: /\.(woff|woff2)$/,
            exclude: /(node_modules|bower_components)/,
            loader: "url-loader?prefix=font/&limit=5000"
        }, {
            test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
            exclude: /(node_modules|bower_components)/,
            loader: "url-loader?limit=10000&mimetype=application/octet-stream"
        }, {
            test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
            exclude: /(node_modules|bower_components)/,
            loader: "url-loader?limit=10000&mimetype=image/svg+xml"
        }]
    },
    plugins: [
        new UglifyJsPlugin({
            beautify: false,
            mangle: { screw_ie8: true },
            compress: { screw_ie8: true, warnings: false },
            comments: false
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            files: {
                css: ['style.css'],
                js: [ "bundle.js"],
            }
        }),
        
        /*
                new CommonsChunkPlugin({
                    name: "vendor",
                    file: "vendor.bundle.js",
                    minChunks: Infinity
                })
                */
    ],
};
