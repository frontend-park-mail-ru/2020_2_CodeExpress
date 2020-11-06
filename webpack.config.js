const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const isProduction = process.env.webpack_type === 'production';
const port = process.env.PORT || 80;
const src = path.join(__dirname, 'src');

module.exports = {
    mode: isProduction ? 'production' : 'development',
    entry: './src/index.ts',
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
    },
    resolve: {
        alias: {
            assets: path.join(src, 'assets'),
            components: path.join(src, 'components'),
            managers: path.join(src, 'managers'),
            store: path.join(src, 'store'),
            models: path.join(src, 'models'),
            views: path.join(src, 'views'),
        },
        extensions: ['.js', '.ts', '.tsx'],
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.hbs$/,
                loader: 'handlebars-loader',

            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: ['babel-loader', 'ts-loader'],
            },
            {
                test: /\.(jpg|png|gif|svg|pdf|ico)$/,
                loader: 'file-loader',

            },
            {
                test: /\.ttf$/,
                use: ['file-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Webpack',
            template: './src/index.html',
            filename: path.join(__dirname, '/dist/index.html'),
            favicon: path.join(__dirname, '/favicon.ico'),
        }),
        new CopyPlugin({
            patterns: [
                { from: './src/assets', to: 'assets' },
            ],
        }),
        new CleanWebpackPlugin(),
        new webpack.EnvironmentPlugin({
            PORT: port,
            DEBUG: process.env.DEBUG,
        }),
        new WorkboxPlugin.GenerateSW({
            exclude: [/^.*\.(mp3)$/],
            mode: 'production',
        }),
    ],
    devServer: {
        publicPath: '/',
        contentBase: '/',
        hot: true,
        port,
        historyApiFallback: true,
    },
    optimization: {
        minimize: true,
    },
};
