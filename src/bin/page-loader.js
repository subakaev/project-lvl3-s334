#!/usr/bin/env node

import program from 'commander';

import pageLoader from '..';
import getErrorMessage from '../error-parser';

program
  .version('0.0.4')
  .description('The utility downloads the page and saves it to the local folder.')
  .arguments('<urlString>')
  .option('--output [path]', 'Output path', __dirname)
  .action((urlString, cmd) => {
    pageLoader(urlString, cmd.output)
      .then(() => {
        console.log('Download completed successfully.');
        process.exit(0);
      })
      .catch((err) => {
        console.error('Download completed with error:');
        console.error(getErrorMessage(err));
        process.exit(1);
      });
  })
  .parse(process.argv);
