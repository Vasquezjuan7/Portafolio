export const TEST_CONFIG = {
  timeoutMs: 5000,
  verbose: true,
};

export function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}
