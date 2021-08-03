import path from 'path';
import webpack from 'webpack';
import 'webpack-dev-server';

const config: webpack.Configuration = {
    mode: 'production',
    entry: './src/index.ts',
    output: {
        path: path.resolve( __dirname, 'dist' ),
        filename: 'index.js'
    },
    resolve: {
        extensions: [ '.ts', '.js' ],
    },
    module: {
        rules: [
            {
                test: /\.tsx?/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    }
}

export default config