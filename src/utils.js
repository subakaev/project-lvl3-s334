import url from 'url';

const getFileNameFromUrl = (urlString) => {
  const { protocol } = url.parse(urlString);

  return urlString
    .slice(`${protocol}//`.length)
    .replace(/\W/g, '-')
    .concat('.html');
};

export default getFileNameFromUrl;
