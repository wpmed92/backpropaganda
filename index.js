#!/usr/bin/env node

const program = require('commander');
const figlet = require('figlet');
const { spawn, fork } = require('child_process')
var path = require("path");

figlet('backpropaganda', function(err, data) {
  if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
  }
  console.log(data)
});

program
  .option('-e, --example <example>', 'Select an example')
  .action(function() {
     if (program.example === "xor") {
      fork(path.join(__dirname, "/examples/multi-layer-xor-train.js"))
      .on('exit', code => {
        console.log(`xor example run successfully`);
      });
     } else if (program.example === "mnist") {
      fork(path.join(__dirname, "/examples/multi-layer-mnist-train.js"))
      .on('exit', code => {
        console.log(`mnist example run successfully`);
      });
     }
  })
 .parse(process.argv);