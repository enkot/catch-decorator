import babel from 'rollup-plugin-babel';

export default {
  input: 'index.js',
  output: [
    { file: 'dist/catch-decorator.umd.js', format: 'umd', name: 'catchDecorator' }
  ],
  plugins: babel()
}
