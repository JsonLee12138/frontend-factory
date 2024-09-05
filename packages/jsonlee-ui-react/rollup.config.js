import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import del from 'rollup-plugin-delete';
import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import alias from '@rollup/plugin-alias';
import path from 'path';
import postcssImport from 'postcss-import';
import dts from 'rollup-plugin-dts';
import packageJson from './package.json' assert { type: 'json' };

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
        plugins: [terser()],
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
        plugins: [terser()],
      },
      {
        file: packageJson.browser,
        format: 'umd',
        name: 'JsonUIReact',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        sourcemap: true,
        plugins: [terser()],
      },
    ],
    plugins: [
      del({ targets: 'dist/*' }),
      alias({
        entries: [{ find: '@', replacement: path.resolve(__dirname, './src') }],
      }),
      resolve({ extensions: ['.js', 'jsx', '.ts', '.tsx'] }),
      commonjs(),
      terser({
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      }),
      babel({
        exclude: 'node_modules/**', // 不对 node_modules 转码
        // presets: ['@babel/preset-react', '@babel/preset-env'], // React 和 ES6+ 预设
        presets: [
          ['@babel/preset-react', { runtime: 'automatic' }],
          ['@babel/preset-env', { modules: false }],
        ],
        babelHelpers: 'bundled',
      }),
      typescript({
        tsconfig: 'tsconfig.json',
        useTsconfigDeclarationDir: true,
      }),
    ],
    external: ['react', 'react-dom', 'lodash-es'],
  },
  {
    input: 'dist/types/index.d.ts',
    output: [{ file: 'dist/types/index.d.ts', format: 'esm' }],
    plugins: [dts.default()],
    external: [/\.css$/],
  },
  {
    input: 'src/styles/style.css',
    output: [{ file: 'dist/styles/style.css', format: 'es' }],
    plugins: [
      postcss({
        extract: true,
        minimize: true,
        plugins: [postcssImport()],
      }),
    ],
  },
];
