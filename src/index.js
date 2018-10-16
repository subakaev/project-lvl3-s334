import axios from 'axios';
import fs from 'fs';
import path from 'path';
import url from 'url';
import cheerio from 'cheerio';

import getFileNameFromUrl from './utils';

const fsPromises = fs.promises;

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
    isLocalPath: () => url.parse(attrValue).host === null,
  };
};

const getOutputPath = (inputPath, contentsDir) => {
  const { dir, base } = path.parse(inputPath);

  const outputFileName = `${dir.slice(1).replace(/[^A-Za-z0-9]/g, '-')}-${base}`;

  return path.resolve(contentsDir, outputFileName);
};

const getHtmlWithListOfFiles = (urlString, contentsFolder, data) => {
  const $ = cheerio.load(data);

  const fileList = [];

  $('img,script,link').each((_, element) => {
    const { attrName, attrValue, isLocalPath } = getAttributeNameAndValue(element);

    if (isLocalPath()) {
      const outputPath = getOutputPath(attrValue, contentsFolder);

      fileList.push({ inputPath: attrValue, outpuPath: `.${outputPath}` });

      $(element).attr(attrName, outputPath);
    }
  });

  return { html: $.html(), files: fileList };
};

const downloadFile = (downloadUrl, savePath) => axios.get(downloadUrl, { responseType: 'arraybuffer' })
  .then(response => fsPromises.writeFile(savePath, response.data));

const getSaveRootPagePromise = (html, urlString, localPath) => {
  const filePath = path.join(localPath, getFileNameFromUrl(urlString));

  return fsPromises.writeFile(filePath, html);
};

const getSaveContentPromises = (list, localPath, { protocol, hostname, port }) => list.map(
  (item) => {
    const downloadUrl = url.format({
      protocol,
      hostname,
      port,
      pathname: item.inputPath,
    });

    const savePath = path.resolve(localPath, item.outpuPath);

    return downloadFile(downloadUrl, savePath);
  },
);

export default (urlString, localPath) => axios.get(urlString)
  .then((response) => {
    const contentsFolder = `/${getFileNameFromUrl(urlString).replace('.html', '')}_files`;

    const { html, files } = getHtmlWithListOfFiles(urlString, contentsFolder, response.data);

    const rootPromise = getSaveRootPagePromise(html, urlString, localPath);

    const filePromises = getSaveContentPromises(files, localPath, url.parse(urlString));

    return Promise.all([rootPromise, ...filePromises]);
  });
