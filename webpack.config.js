const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');

const isProduction = process.env.webpack_type === 'production';
const port = process.env.PORT || 80;
const src = path.join(__dirname, 'src');

module.exports = {
    mode: isProduction ? 'production' : 'development',
    entry: './src/index.ts',
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: 'bundle.[hash:8].js',
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
                test: /\.(jpg|jpeg|png|gif|svg|pdf|ico)$/,
                loader: 'file-loader',

            },
            {
                test: /\.ttf$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name]-[hash:8].[ext]',
                        },
                    },
                ],
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
        new CleanWebpackPlugin(),
        new webpack.EnvironmentPlugin({
            PORT: port,
            DEBUG: !isProduction,
        }),
        new WebpackPwaManifest({
            filename: 'manifest.json',
            name: 'MusicExpress',
            short_name: 'MusicExpress',
            description: 'Музыкальный сервис',
            orientation: 'portrait',
            display: 'standalone',
            background_color: '#1a1b1f',
            theme_color: '#1a1b1f',
            start_url: '.',
            icons: [
                {
                    src: path.join(src, '/music.png'),
                    sizes: [96, 128, 192, 256, 384, 512],
                },
            ],
            ios: {
                'apple-mobile-web-app-status-bar-style': 'black-translucent',
            },
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
