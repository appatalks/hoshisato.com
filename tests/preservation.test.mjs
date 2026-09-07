import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const digest = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');

test('Linda Park autograph remains byte-for-byte original', () => {
  assert.equal(
    digest('images/LindaPark300x300.png'),
    '7d6de292fe2181f4f568ca494e68f2b90d9ca1660a3c5a506ff34f14a2ae4c7c',
  );
});

test('Hoshi portrait reference remains byte-for-byte original', () => {
  assert.equal(
    digest('media/hoshisatoblu.jpg'),
    'f2278a039d5223538130fc3a4a417f810155bb7a40414fbce82497f25c95fbf2',
  );
});

test('GitHub Pages custom domain remains byte-for-byte original', () => {
  assert.equal(digest('CNAME'), '5fedc58672ce08abb051e785103188f6a6709e95a9abe9842dfa1d1a2bdfea99');
});
