import axios from 'axios';
import fs from 'fs';
import path from 'path';

import getFileNameFromUrl from './utils';

const fsPromises = fs.promises;

export default (urlString, localPath) => axios.get(urlString)
  .then((response) => {
    const filePath = path.join(localPath, getFileNameFromUrl(urlString));

    return fsPromises.writeFile(filePath, response.data);
  });
