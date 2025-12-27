import terser from '@rollup/plugin-terser';
import filesize from 'rollup-plugin-filesize';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * ${pkg.description}
 * ${pkg.homepage}
 * MIT License
 * by 2Coders Studio
 */`;

const terserOptions = {
  compress: {
    pure_getters: true,
    unsafe: true,
    unsafe_comps: true,
  },
  format: {
    comments: /^!/,
  },
};

export default [
  // UMD build (for browsers, CDN, script tags)
  {
    input: 'src/jquery.photocols.js',
    output: {
      file: 'dist/jquery.photocols.js',
      format: 'umd',
      name: 'photocols',
      banner,
      exports: 'named',
      globals: {
        jquery: 'jQuery',
      },
      sourcemap: true,
    },
    external: ['jquery'],
    plugins: [filesize()],
  },
  // UMD minified
  {
    input: 'src/jquery.photocols.js',
    output: {
      file: 'dist/jquery.photocols.min.js',
      format: 'umd',
      name: 'photocols',
      banner,
      exports: 'named',
      globals: {
        jquery: 'jQuery',
      },
      sourcemap: true,
    },
    external: ['jquery'],
    plugins: [terser(terserOptions), filesize()],
  },
  // ESM build (for modern bundlers)
  {
    input: 'src/jquery.photocols.js',
    output: {
      file: 'dist/jquery.photocols.esm.js',
      format: 'esm',
      banner,
      sourcemap: true,
    },
    external: ['jquery'],
    plugins: [filesize()],
  },
  // ESM minified
  {
    input: 'src/jquery.photocols.js',
    output: {
      file: 'dist/jquery.photocols.esm.min.js',
      format: 'esm',
      banner,
      sourcemap: true,
    },
    external: ['jquery'],
    plugins: [terser(terserOptions), filesize()],
  },
];
