// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('@expo/metro-config');

// extra config is needed to enable `react-native-svg-transformer`
module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);
  config.resolver = {
    ...config.resolver,
    assetExts: config.resolver.assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...config.resolver.sourceExts, 'svg'],
  };
  return config;
})();
