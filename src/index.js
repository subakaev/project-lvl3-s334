import axios from 'axios';
import fs from 'fs';
import path from 'path';
import url from 'url';
import cheerio from 'cheerio';
import debug from 'debug';
import Listr from 'listr';

import getNameFromUrl from './utils';

const fsPromises = fs.promises;
const logger = debug('page-loader:');

const getAttributeNameAndValue = (cheerioElement) => {
  const elementNames = {
    img: 'src',
    script: 'src',
    link: 'href',
  };

  const attrName = elementNames[cheerioElement.name];
  const attrValue = cheerioElement.attribs[attrName];

  return {
    attrName,
    attrValue,
    isLocalPath: () => attrValue && url.parse(attrValue).host === null,
  };
};

const getOutputPath = (inputPath, contentsDir) => {
  const { dir, base } = path.parse(inputPath);

  const outputFileName = dir !== '/' ? `${dir.slice(1).replace(/\W/g, '-')}-${base}` : base;

  return path.resolve(contentsDir, outputFileName);
};

const getHtmlWithListOfFiles = (contentsFolder, data) => {
  const $ = cheerio.load(data);

  const fileList = [];

  logger('Start analyzing html...');

  $('img,script,link').each((_, element) => {
    const { attrName, attrValue, isLocalPath } = getAttributeNameAndValue(element);

    if (isLocalPath()) {
      const localPath = path.normalize(attrValue);

      const outputPath = getOutputPath(localPath, contentsFolder);

      fileList.push({ inputPath: localPath, outpuPath: `.${outputPath}` });

      $(element).attr(attrName, outputPath);
    }
  });

  logger('Analyzation complete. Found %d content files for download.', fileList.length);

  return { html: $.html(), files: fileList };
};

const downloadFile = (downloadUrl, savePath) => axios.get(downloadUrl, { responseType: 'arraybuffer' })
  .then(response => fsPromises.writeFile(savePath, response.data));

const getSaveRootPagePromise = (html, urlString, localPath) => {
  const filePath = path.join(localPath, getNameFromUrl(urlString, '.html'));

  logger('Saving main page to "%s"', filePath);

  return fsPromises.writeFile(filePath, html);
};

const getContentPromise = (item, localPath, { protocol, hostname, port }) => {
  const downloadUrl = url.format({
    protocol,
    hostname,
    port,
    pathname: item.inputPath,
  });

  const savePath = path.resolve(localPath, item.outpuPath);

  logger('Start downloading the file...');
  logger('From: %s', downloadUrl);
  logger('To: %s', savePath);

  return downloadFile(downloadUrl, savePath);
};

const getCreateContentsFolderPromise = (pathname) => {
  logger('Creating dir for contents: "%s"', pathname);

  return fsPromises.mkdir(pathname);
};

export default (urlString, localPath) => axios.get(urlString)
  .then((response) => {
    const contentsFolder = `/${getNameFromUrl(urlString, '_files')}`;

    const { html, files } = getHtmlWithListOfFiles(contentsFolder, response.data);

    const listr = new Listr([
      {
        title: `Download page from ${urlString}`,
        task: () => getSaveRootPagePromise(html, urlString, localPath),
      },
    ], { concurrent: true });

    files.forEach(item => listr.add({
      title: `Downloading resource from ${item.inputPath}`,
      task: () => getContentPromise(item, localPath, url.parse(urlString)),
    }));

    if (files.length > 0) {
      return getCreateContentsFolderPromise(path.join(localPath, contentsFolder))
        .then(() => listr.run());
    }

    return listr.run();
  });
