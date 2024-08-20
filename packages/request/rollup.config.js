import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import del from 'rollup-plugin-delete';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/cjs/index.js',
      format: 'cjs',
      sourcemap: true,
      plugins: [terser()]
    },
    {
      file: 'dist/esm/index.js',
      format: 'esm',
      sourcemap: true,
      plugins: [terser()]
    }
  ],
  plugins: [
    del({ targets: 'dist/*' }),
    resolve({
      browser: true, // 确保优先使用浏览器版本的模块
      preferBuiltins: true
    }),
    commonjs(),
    typescript({
      tsconfig: "tsconfig.json",
      useTsconfigDeclarationDir: true
    })
  ]
};
