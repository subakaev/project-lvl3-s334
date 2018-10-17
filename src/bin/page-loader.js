#!/usr/bin/env node

import program from 'commander';

import pageLoader from '..';

program
  .version('0.0.2')
  .description('The utility downloads the page and saves it to the local folder.')
  .arguments('<urlString>')
  .option('--output [path]', 'Output path', __dirname)
  .action((urlString, cmd) => {
    pageLoader(urlString, cmd.output)
      .then(() => console.log('Download completed successfully.'))
      .catch((err) => {
        console.log('Download completed with error:');
        console.log(err);
      });
  })
  .parse(process.argv);
