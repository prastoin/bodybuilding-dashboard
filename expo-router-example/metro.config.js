// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const defaultConfig = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
});

// Added mjs and cjs source for react-hook-form
// Please refer to https://github.com/infinitered/ignite/issues/1995
const config = {
  ...defaultConfig,
  resolver: {
    sourceExts: [...defaultConfig.resolver.sourceExts, 'mjs', 'cjs'],
  }
}

module.exports = config;
