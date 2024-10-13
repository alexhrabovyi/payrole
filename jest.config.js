import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config = {
  moduleFileExtensions: [
    'tsx',
    'ts',
    'js',
    'jsx',
    'json',
    'mjs',
    'cjs',
    'node',
  ],
  // The root directory that Jest should scan for tests and modules within
  // rootDir: undefined,
  testEnvironment: 'jsdom',
  // The glob patterns Jest uses to detect test files
  // testMatch: [
  //   "**/__tests__/**/*.[jt]s?(x)",
  //   "**/?(*.)+(spec|test).[tj]s?(x)"
  // ],

  // Indicates whether each individual test should be reported during the run
  // verbose: undefined,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  reporters: [
    "default",
    [
      "./node_modules/jest-html-reporter",
      {
        pageTitle: "Test Report",
        outputPath: './test_report/test-report.html',
      }
    ]
  ],

  // coverage
  collectCoverage: true,
  // An array of glob patterns indicating a set of files for which coverage
  // information should be collected

  // collectCoverageFrom: undefined,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
  ],
  coverageProvider: 'v8',
};

export default createJestConfig(config);
