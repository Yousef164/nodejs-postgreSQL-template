export default {
  testEnvironment: "node",
  roots: ["<rootDir>/testing"],
  testMatch: [
    "**/unit-testing/**/*.spec.js",
    "**/integration-testing/**/*.spec.js"
  ],
  collectCoverageFrom: ["src/**/*.js"],
  clearMocks: true,
};
