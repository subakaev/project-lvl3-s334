import nock from 'nock';
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import path from 'path';
import fs from 'fs';
import os from 'os';

import pageLoader from '../src';

const fsPromises = fs.promises;

const fixturesDir = '__tests__/__fixtures__';
const host = 'http://example.com';

beforeAll(() => {
  axios.defaults.adapter = httpAdapter;
});

test('pageLoader test', async () => {
  const expectedContent = await fsPromises.readFile(path.join(fixturesDir, 'example-com.html'));
  const tempDir = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'pageLoaderTmp-'));

  nock(host).get('/').reply(200, expectedContent);

  await pageLoader(host, tempDir);

  const actualData = await fsPromises.readFile(path.join(tempDir, 'example-com.html'));

  expect(actualData).toEqual(expectedContent);
});
