// webpack.config.js

const path = require('path');
const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');
const CopyPlugin = require('copy-webpack-plugin');

const environment = process.env.NODE_ENV;
let filename, processEnv, filePath, mode, target;
if (environment === 'development') {
    filePath = './dist/bundles/development';
    filename = '[name].js';
    processEnv = {
        NODE_ENV: 'development'
    };
    mode = 'development';
    target = 'electron-renderer';
} else if (environment === 'production') {
    filePath = './dist/bundles/production';
    filename = '[name].js';
    processEnv = {
        NODE_ENV: 'production'
    };
    mode = 'production';
    target = 'electron-renderer';
}

const commonConfig = {
    mode: mode,
    devtool: 'inline-source-map',
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
                loader: "source-map-loader",
                exclude: /node_modules\/@atlaskit\/tree/
            },
            {
                test: /\.(txt|yaml)$/,
                use: 'raw-loader'
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
                use: 'url-loader?limit=30720'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    stats: {
        errorDetails: true,
        errors: true,
        source: true,
    }
};

const rendererConfig = {
    ...commonConfig,
    entry: {
        starter: './src/entries/Starter.tsx',
        editor: './src/entries/Editor.tsx',
    },
    output: {
        path: path.resolve(filePath),
        filename: filename,
        libraryTarget: 'umd',
    },
    plugins: [
        new BundleTracker({
            filename: './webpack-stats.json'
        }),
        new webpack.EnvironmentPlugin(processEnv),
    ],
    target: 'electron-renderer',
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
    }
};

const mainConfig = {
    ...commonConfig,
    entry: {
        main: './src/electron/main.ts',
    },
    output: {
        path: path.resolve(`${filePath}/electron`),
        filename: filename,
        libraryTarget: "umd",
        library: 'flintlib'
    },
    node: {
        __filename: false,
        __dirname: false
    },
    target: 'electron-main',
    plugins: [
        new BundleTracker({
            filename: './webpack-stats.json'
        }),
        new webpack.EnvironmentPlugin(processEnv),
        new CopyPlugin([
            { from: './src/electron/views/starter.html', to: `./` },
            { from: './src/electron/views/editor.html', to: `./` },
            { from: './resources/img/icon.png', to: `./` },
            { from: `./resources/scripts/${environment}/react.js`, to: `./` },
            { from: `./resources/scripts/${environment}/react-dom.js`, to: `./` },
            { from: './src/electron/utils/dev-app-update.yml', to: `./` },
        ]),
    ],
};

module.exports = env => {
    return [rendererConfig, mainConfig]
};