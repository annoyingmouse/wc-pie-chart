import { terser } from 'rollup-plugin-terser';

export default {
  input: './wc-pie-chart.js',
  output: {
    file: 'dist/wc-pie-chart.min.js',
    format: 'iife',
    sourcemap: 'inline'
  },
  plugins: [
    terser()
  ]
};