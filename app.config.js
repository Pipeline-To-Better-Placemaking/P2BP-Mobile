module.exports = ({ config }) => {
  config.android.config.googleMaps.apiKey = process.env.GOOGLE_MAPS_KEY;
  config.ios.config.googleMapsApiKey = process.env.GOOGLE_MAPS_KEY;
  return {
    ...config,
  };
};
