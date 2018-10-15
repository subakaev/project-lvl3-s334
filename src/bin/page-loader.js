#!/usr/bin/env node

import program from 'commander';

import pageLoader from '..';

program
  .version('0.0.1')
  .description('The utility downloads the page and saves it to the local folder.')
  .arguments('<urlString>')
  .option('--output [path]', 'Output path')
  .action((urlString, cmd) => {
    pageLoader(urlString, cmd.output || __dirname)
      .then(() => console.log('Done.'))
      .catch(err => console.log(err));
  })
  .parse(process.argv);
