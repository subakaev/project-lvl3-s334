import url from 'url';

const getFileNameFromUrl = (urlString) => {
  const { protocol } = url.parse(urlString);

  return urlString
    .slice(`${protocol}//`.length)
    .replace(/[^A-Za-z0-9]/g, '-')
    .concat('.html');
};

export default getFileNameFromUrl;
