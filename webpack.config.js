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
            ],
            alias: {
                src: path.resolve(__dirname, 'src'),
                resources: path.resolve(__dirname, 'resources'),
                pjson: path.resolve(__dirname, 'package.json'),
            }
        },
        entry: {
            starter: './src/entries/Starter.tsx',
            editor: './src/entries/Editor.tsx'
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
                    test: /\.(txt|yaml)$/,
                    use: 'raw-loader'
                },
                {
                    test: /\.(png|jpg)$/,
                    use: 'url-loader?limit=30720'
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                }
            ]
        },
        plugins: [
            new BundleTracker({
                filename: './webpack-stats.json'
            }),
            new webpack.EnvironmentPlugin(processEnv)
        ],
        target: target,
        stats: {
            errorDetails: true,
            errors: true,
            source: true,
        }
    }
};