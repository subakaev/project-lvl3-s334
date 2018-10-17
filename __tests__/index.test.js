import nock from 'nock';
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import path from 'path';
import fs from 'fs';
import os from 'os';

import downloadPage from '../src';

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

  await downloadPage(host, tempDir);

  const actualData = await fsPromises.readFile(path.join(tempDir, 'example-com.html'));

  expect(actualData).toEqual(expectedContent);
});

test('page-loader should download with resources', async () => {
  const inputHtmlPath = path.join(fixturesDir, 'example-com-contents-source.html');
  const inputHtml = await fsPromises.readFile(inputHtmlPath);

  const expectedHtmlPath = path.join(fixturesDir, 'example-com-contents.html');
  const expectedHtml = await fsPromises.readFile(expectedHtmlPath, 'utf8');

  const tempDir = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'pageLoaderTmp-'));
  const tempContentsDir = path.join(tempDir, 'example-com_files');

  const contentsDir = path.join(fixturesDir, 'example-com-contents_files');
  const file1Path = path.join(contentsDir, 'styles-style.css');
  const file1Data = await fsPromises.readFile(file1Path, 'utf8');

  const file2Path = path.join(contentsDir, 'assets-script-in-head.txt');
  const file2Data = await fsPromises.readFile(file2Path, 'utf8');

  const file3Path = path.join(contentsDir, 'assets-script-in-body.txt');
  const file3Data = await fsPromises.readFile(file3Path, 'utf8');

  const file4Path = path.join(contentsDir, 'img-picture.png');
  const file4Data = await fsPromises.readFile(file4Path, 'utf8');

  nock(host)
    .get('/')
    .reply(200, inputHtml)
    .get('/styles.css')
    .reply(200, file1Data)
    .get('/assets/script-in-head.js')
    .reply(200, file2Data)
    .get('/assets/script-in-body.js')
    .reply(200, file3Data)
    .get('/img/picture.png')
    .reply(200, file4Data);

  await downloadPage(host, tempDir);

  const actualHtml = await fsPromises.readFile(path.join(tempDir, 'example-com.html'), 'utf8');
  expect(actualHtml).toEqual(expectedHtml);

  const actualFile1Path = path.join(tempContentsDir, 'styles.css');
  const actualFile1Data = await fsPromises.readFile(actualFile1Path, 'utf8');
  expect(actualFile1Data).toEqual(file1Data);

  const actualFile2Path = path.join(tempContentsDir, 'assets-script-in-head.js');
  const actualFile2Data = await fsPromises.readFile(actualFile2Path, 'utf8');
  expect(actualFile2Data).toEqual(file2Data);

  const actualFile3Path = path.join(tempContentsDir, 'assets-script-in-body.js');
  const actualFile3Data = await fsPromises.readFile(actualFile3Path, 'utf8');
  expect(actualFile3Data).toEqual(file3Data);

  const actualFile4Path = path.join(tempContentsDir, 'img-picture.png');
  const actualFile4Data = await fsPromises.readFile(actualFile4Path, 'utf8');
  expect(actualFile4Data).toEqual(file4Data);
});
