module.exports = {
  roots: ["<rootDir>/src"],
  testMatch: ["**/*.test.[jt]s?(x)"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testTimeout: 10000,
};
