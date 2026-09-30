import assert from 'node:assert/strict';
import test from 'node:test';
import { createTask, getTasks } from '../controllers/taskController.js';
import { getUtcDayRange, isDateOnly } from '../utils/dateOnly.js';

test('accepts valid date-only values, including leap days', () => {
  assert.equal(isDateOnly('2026-09-30'), true);
  assert.equal(isDateOnly('2024-02-29'), true);
});

test('rejects malformed and impossible date-only values', () => {
  for (const value of ['2026-02-29', '2026-13-01', '2026-9-01', '', null]) {
    assert.equal(isDateOnly(value), false, `expected ${value} to be invalid`);
  }
});

test('creates a UTC day range that crosses month and year boundaries', () => {
  const { start, end } = getUtcDayRange('2026-12-31');
  assert.equal(start.toISOString(), '2026-12-31T00:00:00.000Z');
  assert.equal(end.toISOString(), '2027-01-01T00:00:00.000Z');
});

test('rejects impossible dates in API filters before querying MongoDB', async () => {
  const response = createResponse();
  let passedToErrorHandler = false;

  await getTasks({ query: { date: '2026-02-30' } }, response, () => {
    passedToErrorHandler = true;
  });

  assert.equal(response.statusCode, 400);
  assert.equal(response.body.success, false);
  assert.equal(passedToErrorHandler, false);
});

test('rejects task creation without a valid date', async () => {
  const response = createResponse();
  let passedToErrorHandler = false;

  await createTask({ body: { title: 'Read chapter', category: 'Study', priority: 'High' } }, response, () => {
    passedToErrorHandler = true;
  });

  assert.equal(response.statusCode, 400);
  assert.equal(response.body.success, false);
  assert.equal(passedToErrorHandler, false);
});

function createResponse() {
  return {
    statusCode: null,
    body: null,
    status(statusCode) {
      this.statusCode = statusCode;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}