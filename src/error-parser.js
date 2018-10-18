export default (err) => {
  switch (err.code) {
    case 'ENOTFOUND':
      return `Url ${err.config.url} not found.`;
    case 'ENOENT':
      return `Path ${err.path} not exists`;
    case 'EACCES':
      return `Cannot access to ${err.path}.`;
    default:
      return 'Unknown error has occured';
  }
};
