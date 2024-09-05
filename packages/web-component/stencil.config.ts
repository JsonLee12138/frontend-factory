import { Config } from '@stencil/core';
import tailwind, { tailwindHMR, setPluginConfigurationDefaults } from 'stencil-tailwind-plugin';
import tailwindConf from './tailwind.config';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

setPluginConfigurationDefaults({
  tailwindConf,
  tailwindCssPath: './src/styles/tailwind.css',
  postcss: {
    plugins: [
      tailwindcss(),
      autoprefixer()
    ]
  }
});

export const config: Config = {
  namespace: 'json-web-component',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: false,
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  testing: {
    browserHeadless: "new",
  },
  devServer: {
    openBrowser: false,
    reloadStrategy: 'pageReload'
  },
  plugins: [
    tailwind(),
    tailwindHMR(),
  ]
};
