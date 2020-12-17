module.exports = {
  globals: {},
  reporters: ["default", "jest-junit"],
  moduleFileExtensions: ["js"],
  testMatch: ["**/*.test.js"],
  testEnvironment: "node",
  modulePaths: ["node_modules", "."],
  testPathIgnorePatterns: ["node_modules", "prod_node_modules"]
};
