const path = require( 'path' );

module.exports = {
    mode: 'production',
    entry: './src/index.ts',
    output: {
        path: path.resolve( __dirname, 'dist' ),
        filename: 'index.js',
        libraryTarget: 'module'
    },
    experiments: {
        outputModule: true
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