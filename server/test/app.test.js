import assert from 'node:assert/strict';
import { once } from 'node:events';
import test from 'node:test';
import app from '../app.js';

test('serves the React app on browser routes without swallowing API routes', async (context) => {
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  context.after(() => new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  }));

  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  for (const route of ['/', '/tasks', '/calendar', '/pending', '/completed']) {
    const response = await fetch(`${baseUrl}${route}`);
    const html = await response.text();
    assert.equal(response.status, 200, `${route} should serve the React app`);
    assert.match(html, /<div id="root"><\/div>/);
  }

  const healthResponse = await fetch(`${baseUrl}/api/health`);
  assert.equal(healthResponse.status, 200);
  assert.deepEqual(await healthResponse.json(), { success: true, data: { status: 'ok' } });

  const unknownApiResponse = await fetch(`${baseUrl}/api/not-a-route`);
  assert.equal(unknownApiResponse.status, 404);
  assert.match(unknownApiResponse.headers.get('content-type'), /application\/json/);
});