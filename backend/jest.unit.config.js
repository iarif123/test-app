module.exports = {
  globals: {
    "ts-jest": {}
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  reporters: ["default", "jest-junit"],
  moduleFileExtensions: ["ts", "js", "json"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  testEnvironment: "node",
  modulePaths: ["node_modules", "."],
  testPathIgnorePatterns: ["node_modules", "prod_node_modules"]
};