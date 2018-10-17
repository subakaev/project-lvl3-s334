import url from 'url';

const getNameFromUrl = (urlString, postfix) => {
  const { protocol } = url.parse(urlString);

  return urlString
    .slice(`${protocol}//`.length)
    .replace(/\W/g, '-')
    .concat(postfix);
};

export default getNameFromUrl;
