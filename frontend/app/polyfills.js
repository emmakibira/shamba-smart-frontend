// polyfills.js
if (typeof global === 'undefined') {
  var global = typeof window !== 'undefined' ? window : this;
}

// Mock the keep-awake module
try {
  require('expo-keep-awake');
} catch (error) {
  console.log('Keep awake module not available, using mock');
  module.exports = {
    useKeepAwake: () => {},
    activateKeepAwake: async () => {},
    deactivateKeepAwake: async () => {},
  };
}