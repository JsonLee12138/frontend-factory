import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import del from 'rollup-plugin-delete';
import alias from '@rollup/plugin-alias';
import path from 'path';
import copy from 'rollup-plugin-copy';
import dts from 'rollup-plugin-dts';
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
    ],
    plugins: [
      del({ targets: 'dist/*' }),
      alias({
        entries: [
          { find: '@', replacement: path.resolve(__dirname, './src') },
          { find: '@/types', replacement: path.resolve(__dirname, './types') },
        ],
      }),
      resolve({
        browser: true, // 确保优先使用浏览器版本的模块
        preferBuiltins: true,
      }),
      commonjs(),
      typescript({
        tsconfig: 'tsconfig.json',
        useTsconfigDeclarationDir: true,
        clean: true,
      }),
    ],
  },
  {
    input: 'dist/types/src/index.d.ts',
    output: [{ file: 'dist/types/index.d.ts', format: 'esm' }],
    plugins: [
      dts.default(),
      copy({
        targets: [{ src: 'types/**/*', dest: 'dist/types' }],
      }),
      fixDTSImports(),
      clean('dist/types/src'),
    ],
    external: [/\.css$/],
  },
];
