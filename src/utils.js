import url from 'url';

const getNameFromUrl = (urlString, postfix) => {
  const { host, path } = url.parse(urlString);

  return `${host}${path === '/' ? '' : path}`
    .replace(/\W/g, '-')
    .concat(postfix);
};

export default getNameFromUrl;
