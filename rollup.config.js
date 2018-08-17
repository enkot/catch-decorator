import typescript from 'rollup-plugin-typescript2';

export default {
    input: 'src/index.ts',
    output: [{
        name: 'catch-decorator',
        file: 'dist/index.js',
        format: 'umd'
    }],
    plugins: [
        {
            banner() {
                return '/** MIT licence */';
            }
        },
        typescript()
    ]
}