import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import { terser } from "rollup-plugin-terser";
import pkg from './package.json';

export default {
  input: 'src/index.js',
  output: {
    file: pkg.main,
    format: 'es'
  },
  plugins: [
    serve(), // index.html should be in root of project
    livereload('dist'),
    resolve(),
    commonjs(),
    terser(),
  ]
};
