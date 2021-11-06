const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
const filename = ext => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;
const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }
    if (isProd) {
        config.minimizer = [
            new OptimizeCssAssetsWebpackPlugin(),
            new TerserWebpackPlugin()
        ]
    }
    return config
};

module.exports = {
    mode: 'development',
    context: path.resolve(__dirname, 'src'),
    entry: {
        main: './index.js'
    },
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist'),
        publicPath: ''
    },
    devServer: {
        port: 4200,
        hot: isDev,
        headers: {
            "Access-Control-Allow-Origin": "http://localhost:4200/",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        }
    },

    stats: 'none',
    resolve: {
        extensions: ['.js', '.html', '.css', '.scss', '.png', '.jpg', '.svg', '.jpeg'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@scss': path.resolve(__dirname, 'src/styles_scss'),
            '@img': path.resolve(__dirname, 'src/assets/img'),
            '@modules': path.resolve(__dirname, 'src/modules')
            // '@fonts': path.resolve(__dirname, 'src/assets/fonts'),
            // '@svg': path.resolve(__dirname, 'src/assets/svg'),
        }
    },
    optimization: optimization(),
    plugins: [
        new HTMLWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css'
        }),
        new CopyWebpackPlugin({
            patterns: [
                // {
                //     from: path.resolve(__dirname, 'src/assets/favicon'),
                //     to: path.resolve(__dirname, 'momentum/assets/favicon')
                // },
                // {
                //     from: path.resolve(__dirname, 'src/assets/sounds'),
                //     to: path.resolve(__dirname, 'momentum/assets/sounds')
                // }
            ]
        })
    ],
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { sourceMap: isDev } },
                    { loader: 'sass-loader', options: { sourceMap: isDev } },
                ]
            },
            {
                test: /\.(png|jpg|jpeg)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'cashed/img/[hash][ext]'
                },
            },
            {
                test: /\.svg$/,
                type: 'asset/resource',
                generator: {
                    filename: 'cashed/svg/[hash][ext]'
                },
            },
        ]
    },
};