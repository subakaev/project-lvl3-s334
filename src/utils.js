import url from 'url';

const getFolderNameFromUrl = (urlString) => {
  const { protocol } = url.parse(urlString);

  return urlString
    .slice(`${protocol}//`.length)
    .replace(/[^A-Za-z0-9]/g, '-')
    .concat('.html');
};

export default getFolderNameFromUrl;
