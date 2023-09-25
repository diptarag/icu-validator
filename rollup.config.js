import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json' assert {
  type: 'json'
}

export default {
  input: 'src/index.ts',
  output: [{
    file: pkg.main,
    format: 'cjs'
  }, {
    file: pkg.module,
    format: 'es'
  }],
  plugins: [
    resolve(),
    commonjs(),
    typescript()
  ],
};
