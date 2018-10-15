import nock from 'nock';
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import path from 'path';
import fs from 'fs';
import os from 'os';

import pageLoader from '../src';

const fixturesDir = '__tests__/__fixtures__';
const url = 'http://example.com';

beforeAll(() => {
  axios.defaults.adapter = httpAdapter;
});

test('pageLoader test', async () => {
  const expectedContent = fs.readFileSync(path.join(fixturesDir, 'example-com.html'));
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pageLoaderTmp-'));

  nock(url).get('/').reply(200, expectedContent);

  await pageLoader(url, tempDir);

  const actualData = fs.readFileSync(path.join(tempDir, 'example-com.html'));

  expect(actualData).toEqual(expectedContent);
});
