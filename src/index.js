import axios from 'axios';
import fs from 'fs';
import path from 'path';
import url from 'url';
import cheerio from 'cheerio';

import getFileNameFromUrl from './utils';

const fsPromises = fs.promises;

const getModifiedHtmlWithListOfFiles = (urlString, data) => {
  const $ = cheerio.load(data);

  const contentsFolder = '/' + getFileNameFromUrl(urlString).replace('.html', '') + '_files';

  const fileList = [];

  $('img,script').each((index, element) => {
    const {src} = element.attribs;

    const { host } = url.parse(src);

    if (!host) {
      const { dir, base } = path.parse(src);

      const newPath = path.resolve(contentsFolder, dir.slice(1).replace(/[^A-Za-z0-9]/g, '-').concat('-').concat(base));

      fileList.push({ inputPath: src, outpuPath: `.${newPath}` });

      $(element).attr('src', newPath);
    }

    console.log($(element).attr('src'));
  });

  $('link').each((index, element) => {
    const {href} = element.attribs;

    const { host } = url.parse(href);

    if (!host) {
      const { dir, base } = path.parse(href);

      const newPath = path.resolve(contentsFolder, dir.slice(1).replace(/[^A-Za-z0-9]/g, '-').concat('-').concat(base));

      fileList.push({ inputPath: href, outpuPath: `.${newPath}` });

      $(element).attr('href', newPath);
    }

    console.log($(element).attr('href'));
  });

  return { html: $.html(), files: fileList };
};

const downloadFile = (urlString, localPath) => {
  return axios.get(urlString).then(response => {
    return fsPromises.writeFile(localPath, response.data);
  });
};

export default (urlString, localPath) => axios.get(urlString)
  .then((response) => {
    const { html, files } = getModifiedHtmlWithListOfFiles(urlString, response.data);

    console.log(files);

    const parsed = url.parse(urlString);
    console.log(parsed);

    const filePath = path.join(localPath, getFileNameFromUrl(urlString));

    const filePromises = files.map((item) => {
      const downloadUrl = url.format({
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        pathname: item.inputPath,
      });

      const savePath = path.resolve(localPath, item.outpuPath);

      return axios.get(downloadUrl, { responseType: 'arraybuffer' })
        .then((resp) => {
          console.log(savePath);
          const fileData = resp.data;// new Buffer(response.data, 'binary').toString('base64');
          return fsPromises.writeFile(savePath, fileData)
            .catch(err => console.log(err));
        });
    });

    return Promise.all([fsPromises.writeFile(filePath, html), ...filePromises]);
  });
