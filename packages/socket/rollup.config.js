import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/cjs/index.js',
      format: 'cjs',
      sourcemap: true,
      plugins: [terser()],
    },
    {
      file: 'dist/esm/index.js',
      format: 'esm',
      sourcemap: true,
      plugins: [terser()],
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: 'tsconfig.json',
      useTsconfigDeclarationDir: true,
    }),
  ],
};
