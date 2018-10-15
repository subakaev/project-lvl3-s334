import axios from 'axios';
import fs from 'fs';
import path from 'path';

import getFileNameFromUrl from './utils';

const fsPromises = fs.promises;

export default (urlString, localPath) => {
  return axios.get(urlString)
    .then((response) => {
      console.log(response);
      return response.data;
    }).then((data) => {
      const fileName = getFileNameFromUrl(urlString);
      const filePath = path.join(localPath, fileName);

      fs.writeFileSync(filePath, data);

      return true;
    });
};
