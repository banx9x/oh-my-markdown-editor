import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import css from 'rollup-plugin-import-css';
const packageJson = require('./package.json');

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: 'inline',
        inlineDynamicImports: true,
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: 'inline',
        inlineDynamicImports: true,
      },
    ],
    plugins: [
      resolve(),
      css(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
    ],
  },
  {
    input: 'dist/esm/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    external: [/\.css$/],
    plugins: [dts()],
  },
];
