/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  rootDir: './',
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    '<rootDir>/packages/**/src/**/*.ts',
    '!<rootDir>/packages/**/src/**/index.ts',
  ],
  testPathIgnorePatterns: ['<rootDir>/node_modules'],
  moduleFileExtensions: ['ts', 'js'],
  // each package will need to be configured inside projects
  projects: [
    {
      displayName: 'Material UI Package',
      testEnvironment: 'jsdom',
      transform: {
        '^.+\\.ts?$': 'ts-jest',
      },
      testMatch: [
        '<rootDir>/packages/mui/src/components/**/*.test.ts',
        '<rootDir>/packages/mui/src/components/**/*.test.tsx',
        '<rootDir>/packages/supabase/src/**/*.test.ts',
      ]
    }
  ]
};