#!/usr/bin/env node

const program = require('commander');
const figlet = require('figlet');
const { spawn, fork } = require('child_process')
var path = require("path");
var inquirer = require("inquirer");

console.log(figlet.textSync('backpropaganda'));

inquirer
  .prompt([
    {
      type: 'list',
      message: 'Select an example',
      name: 'examples',
      choices: [
        {
          name: 'Build a network',
          value: "build"
        },
        {
          name: 'The XOR problem',
          value: "xor"
        },
        {
          name: 'Recognizing handwritten digits',
          value: "mnist"
        },
        {
          name: 'Recognizing clothes',
          value: "fashion"
        }
    ]}
  ])
  .then(answers => {
    if (answers.examples === "build") {
      console.log("Yay, build a network!");
    } else if (answers.examples === "xor") {
      fork(path.join(__dirname, "/examples/multi-layer-xor-train.js"))
      .on('exit', code => {
        console.log(`xor example run successfully`);
      });
    } else if (answers.examples === "mnist") {
      fork(path.join(__dirname, "/examples/multi-layer-mnist-train.js"))
      .on('exit', code => {
        console.log(`mnist example run successfully`);
      });
    } else {
      console.log("Not yet supported.");
    }
  });

/*program
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
 .parse(process.argv);*/