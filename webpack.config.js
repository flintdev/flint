//
const path = require('path');
const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');

module.exports = env => {
    const environment = process.env.NODE_ENV;
    let filename, processEnv, filePath, mode, target;
    if (environment === 'development') {
        filePath = './dist/bundles/';
        filename = '[name].js';
        processEnv = {
            NODE_ENV: 'development'
        };
        mode = 'development';
        target = 'electron-renderer';
    } else if (environment === 'production') {
        filePath = './dist/bundles/';
        filename = '[name].js';
        processEnv = {
            NODE_ENV: 'production'
        };
        mode = 'production';
        target = 'electron-renderer';
    }

    return {
        context: __dirname,
        mode: mode,
        devtool: 'source-map',
        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
            modules: [
                'node_modules',
                path.resolve('./src')
            ],
            alias: {
                src: path.resolve('./src')
            }
        },
        entry: {
            starter: './src/entry/starter.tsx'
        },
        output: {
            path: path.resolve(filePath),
            filename: filename,
            libraryTarget: "umd",
            library: 'flintlib'
        },
        module: {
            rules: [
                {
                    test: /\.ts(x?)$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: "ts-loader"
                        }
                    ]
                },
                {
                    enforce: "pre",
                    test: /\.js$/,
                    loader: "source-map-loader"
                },
                {
                    test: /\.txt$/,
                    use: 'raw-loader'
                },
                {
                    test: /\.(png|jpg)$/,
                    use: 'url-loader?limit=30720'
                }
            ]
        },
        plugins: [
            new BundleTracker({
                filename: './webpack-stats.json'
            }),
            new webpack.EnvironmentPlugin(processEnv)
        ],
        // target: target,
        stats: {
            errorDetails: true,
            errors: true,
            source: true,
        }
    }
};