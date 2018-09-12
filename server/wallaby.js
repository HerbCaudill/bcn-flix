module.exports = function(wallaby) {
  return {
    files: [
      '__mocks__/**/*',
      '__tests__/_assets/**/*',
      '__tests__/_utils/**/*',
      'src/**/*.ts?(x)',
    ],
    filesWithNoCoverageCalculated: ['**/lib/**.*'],
    tests: ['__tests__/**/*.test.ts?(x)'],
    compilers: {
      '**/*.ts?(x)': wallaby.compilers.typeScript({
        module: 'commonjs',
      }),
    },
    env: {
      type: 'node',
    },
    testFramework: 'jest',
  }
}
