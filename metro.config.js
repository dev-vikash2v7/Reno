const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Enable CSS support.
  isCSSEnabled: true,

  resolver: {
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'cjs', 'json', 'mjs'],
  },
});

module.exports = config;