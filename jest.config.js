module.exports = {
    preset: 'ts-jest/presets/default-esm',  // Use the ESM preset
    globals: {
      'ts-jest': {
        useESM: true
      }
    },
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1', // Add this to help Jest understand imports
    },
    extensionsToTreatAsEsm: ['.ts'],  // Treat .ts files as ESM
    testEnvironment: 'node',
    transform: {
      '^.+\\.tsx?$': 'ts-jest'
    },
  };