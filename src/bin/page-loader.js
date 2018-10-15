#!/usr/bin/env node

import program from 'commander';

program
  .version('0.0.1')
  .description('The utility downloads the page and saves it to the local folder.')
  .arguments('<address>')
  .option('--output [path]', 'Output path')
  .action((address, cmd) => {
    console.log(address);
    console.log(cmd.output);
  })
  .parse(process.argv);
