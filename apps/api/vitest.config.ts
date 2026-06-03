import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/__tests__/**/*.test.ts'],
    // Increased timeout for integration tests that hit real DB
    testTimeout: 15000,
    hookTimeout: 30000,
  },
});
