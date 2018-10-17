#!/usr/bin/env node

import program from 'commander';

import pageLoader from '..';

program
  .version('0.0.3')
  .description('The utility downloads the page and saves it to the local folder.')
  .arguments('<urlString>')
  .option('--output [path]', 'Output path', __dirname)
  .action((urlString, cmd) => {
    pageLoader(urlString, cmd.output)
      .then(() => console.log('Download completed successfully.'))
      .catch((err) => {
        console.error('Download completed with error:');
        console.error(err);
      });
  })
  .parse(process.argv);
