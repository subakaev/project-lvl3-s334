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

test('page-loader should download without resources', async () => {
  const expectedContent = await fsPromises.readFile(path.join(fixturesDir, 'example-com.html'));
  const tempDir = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'pageLoaderTmp-'));

  nock(host).get('/').reply(200, expectedContent);

  expect.assertions(1);

  await pageLoader(host, tempDir);

  const actualData = await fsPromises.readFile(path.join(tempDir, 'example-com.html'));

  expect(actualData).toEqual(expectedContent);
});

test('page-loader should download with resources', async () => {
  const inputHtmlPath = path.join(fixturesDir, 'example-com-contents-source.html');
  const inputHtml = await fsPromises.readFile(inputHtmlPath);

  const expectedHtmlPath = path.join(fixturesDir, 'example-com-contents.html');
  const expectedHtml = await fsPromises.readFile(expectedHtmlPath);

  const tempDir = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'pageLoaderTmp-'));

  nock(host)
    .get('/')
    .reply(200, inputHtml)
    .get('/styles/style.css')
    .reply(200, {})
    .get('/assets/script-in-head.js')
    .reply(200, {})
    .get('/assets/script-in-body.js')
    .reply(200, {})
    .get('/img/picture.png')
    .reply(200, {});

  await pageLoader(host, tempDir);

  const actualHtml = await fsPromises.readFile(path.join(tempDir, 'example-com.html'));

  expect(actualHtml).toEqual(expectedHtml);
});
