module.exports = function(wallaby) {
  return {
    files: ['assets/**/*', 'src/**/*.ts?(x)', '!src/**/*.test.ts?(x)'],
    filesWithNoCoverageCalculated: ['src/lib/**.*'],
    tests: ['src/**/*.test.ts?(x)'],
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
