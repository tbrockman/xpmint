import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import dts from 'rollup-plugin-dts'

const config = [
    {
        input: './lib/index.js',
        output: {
            file: 'dist/index.cjs',
            format: 'umd',
            name: 'Xpmint'
        },
        plugins: [
            commonjs({
                include: [
                  /node_modules/
                ],
            }),
            nodeResolve()
        ]
    },
    {
        input: './lib/index.js',
        output: {
            dir: 'dist',
        },
        plugins: [
            commonjs({
                include: [
                  /node_modules/
                ],
            }),
            nodeResolve()
        ]
    },
    {
        input: "./lib/index.d.ts",
        output: [{ file: "dist/index.d.ts", format: "es" }],
        plugins: [dts()],
    }
]
export default config