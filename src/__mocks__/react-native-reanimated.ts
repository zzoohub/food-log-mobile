/**
 * Mock for react-native-reanimated
 */

const Reanimated = require('react-native-reanimated/mock');

// Add any missing mocks if needed
Reanimated.default.call = () => {};

module.exports = Reanimated;