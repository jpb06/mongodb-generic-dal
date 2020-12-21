module.exports = {
   testMatch: ["**/__tests__/**/*.+(ts)", "**/?(*.)+(spec|test).+(ts)"],
   transform: {
      "^.+\\.(ts)$": "ts-jest",
   },
   coverageReporters: [
      "json-summary",
      "text",
      "lcov"
   ],
   collectCoverageFrom: [
      "<rootDir>/src/**/*.ts",
   ],
   coveragePathIgnorePatterns: [
      "/node_modules/",
      "/src/tests-related/",
      "index.ts",
      ".d.ts"
   ],
   setupFiles: ["dotenv-flow/config"],
};