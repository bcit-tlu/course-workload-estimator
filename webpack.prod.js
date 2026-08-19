process.env.NODE_ENV = 'production';
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
    entry: './index.js',
    mode: 'production',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name]_bundle.js',
        clean: true,
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'public', 'index.html')
        }),
        new CopyPlugin({
            patterns: [
                { from: './public/favicon.ico', to: 'favicon.ico' },
                { from: './src/assets/bcit_rev.png', to: 'bcit_rev.png' }
            ]
        }),
        new CompressionPlugin({
            algorithm: "gzip",
            test: /\.(js|jsx|css)$/i,
        }),
    ]
};
