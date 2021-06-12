const path = require('path');
const slsw = require('serverless-webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    context: process.cwd(),
    mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
    entry: slsw.lib.entries,
    devtool: slsw.lib.webpack.isLocal ? 'eval-cheap-module-source-map' : 'source-map',
    target: 'node',
    resolve: {
        extensions: ['.ts', '.js'],
        symlinks: true,
        cacheWithContext: false,
    },
    output: {
        libraryTarget: 'commonjs',
        path: path.join(process.cwd(), '.webpack'),
        filename: '[name].js',
    },
    optimization: {
        concatenateModules: true,
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
                extractComments: false,
            }),
        ],
    },
    module: {
        rules: [
            {
                test: /\.(tsx?)$/,
                loader: 'ts-loader',
                exclude: [
                    [
                        path.resolve(process.cwd(), 'node_modules'),
                        path.resolve(process.cwd(), '.serverless'),
                        path.resolve(process.cwd(), '.webpack'),
                    ],
                ],
                options: {
                    transpileOnly: true,
                    experimentalWatchApi: true,
                },
            },
        ],
    },
    plugins: [],
};
