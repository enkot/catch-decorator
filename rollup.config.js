import path from 'path';
import typescript from 'rollup-plugin-typescript2';
import license from 'rollup-plugin-license';

export default {
    input: 'src/index.ts',
    output: [{
        name: 'catch-decorator',
        file: 'dist/index.js',
        format: 'umd'
    }],
    plugins: [
        license({
            sourceMap: true,
            banner: {
                file: path.join(__dirname, 'LICENSE'),
                encoding: 'utf-8'
            },
        }),
        typescript()
    ]
}