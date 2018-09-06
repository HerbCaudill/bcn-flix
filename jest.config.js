module.exports = {
  verbose: true,
  testEnvironment: 'node',
  // collectCoverageFrom: [
  //   'src/**/*.{ts,tsx}',
  //   'api/**/*.{ts,tsx}',
  // ],
  // coverageDirectory: '.coverage',
  // coverageReporters: ['lcov'],
  testRegex: '.*test\\.ts',
  moduleDirectories: ["node_modules", "src", "api"],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
}
