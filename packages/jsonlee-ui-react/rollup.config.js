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
import copy from 'rollup-plugin-copy';
import fs from 'fs';
import packageJson from './package.json' assert { type: 'json' };

const fixDTSImports = () => {
  return {
    name: 'fix-dts-imports',
    writeBundle() {
      const dtsFilePath = path.resolve(__dirname, 'dist/types/index.d.ts');
      let content = fs.readFileSync(dtsFilePath, 'utf-8');
      // 替换 "@/types" 别名为相对路径
      content = content.replace(/@\/types\//g, './');

      fs.writeFileSync(dtsFilePath, content);
    },
  };
};

const clean = (_path) => {
  return {
    name: 'clean',
    writeBundle() {
      const cleanPath = path.resolve(__dirname, _path);
      // 检查路径是否存在
      if (fs.existsSync(cleanPath)) {
        fs.rmSync(cleanPath, { recursive: true, force: true }); // 删除整个目录
        console.log(`Deleted ${cleanPath}`);
      }
    },
  };
};

export default [
  {
    input: 'src/component/index.ts',
    output: [
      // {
      //   file: packageJson.main,
      //   format: 'cjs',
      //   sourcemap: true,
      //   plugins: [terser()],
      // },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
        plugins: [terser()],
      },
      // {
      //   file: packageJson.browser,
      //   format: 'umd',
      //   name: 'JsonUIReact',
      //   globals: {
      //     react: 'React',
      //     'react-dom': 'ReactDOM',
      //   },
      //   sourcemap: true,
      //   plugins: [terser()],
      // },
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
    input: 'dist/types/src/component/index.d.ts',
    output: [{ file: 'dist/types/index.d.ts', format: 'esm' }],
    plugins: [
      dts.default(),
      copy({
        targets: [{ src: 'src/types/*', dest: 'dist/types/' }],
      }),
      fixDTSImports(),
      clean('dist/types/src'),
    ],
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
