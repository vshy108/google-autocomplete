import { expect, test } from 'vitest';
import { listRemote } from '../../../src/redux/sagas/location';
const sum = (a, b) => a + b;

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
