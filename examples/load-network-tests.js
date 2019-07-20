var Network = require('../lib/network');
var util = require('../lib/util');
var mnist = require('mnist');

//xor net test
let network = new Network();
console.log("Network: 'xor.json' \n");
network.load("xor"); //Load any network %id% you previously saved with 'network.save(%id%)'

var set = [
    {
        input: [1, 0],
        output: [1]
    },
    {
        input: [0, 1],
        output: [1]
    },
    {
        input: [1, 1],
        output: [0]
    },
    {
        input: [0, 0],
        output: [0]
    },
];

//Evaluate
for (let i = 0; i < set.length; i++) {
  network.loadInput(set[i].input);
  let test = network.activate(); 
  console.log("Expected: " + set[i].output + ", activation: " + test);
}

//mnist load test
console.log("\nNetwork: 'mnist-net-test.json' \n");
var TRAINING_SIZE = 8000;
var TEST_SIZE = 300;

network.load("mnist-net-test");
var mnistSet = mnist.set(TRAINING_SIZE, TEST_SIZE);

//Evaluate
let testCorrect = 0;
let trainingCorrect = 0;

//Training
for (let i = 0; i < TRAINING_SIZE; i++) {
    network.loadInput(mnistSet.training[i].input);
    let test = network.activate();

    if (util.argMax(test) == util.argMax(mnistSet.training[i].output)) {
        trainingCorrect++;
    }
}

//Test
for (let i = 0; i < TEST_SIZE; i++) {
    network.loadInput(mnistSet.test[i].input);
    let test = network.activate();

    if (util.argMax(test) == util.argMax(mnistSet.test[i].output)) {
        testCorrect++;
    }
}

console.log("---Net report---")
console.log("-dataset: MNIST");
console.log("-training data size: " + TRAINING_SIZE);
console.log("-test data size: " + TEST_SIZE);
console.log("------------------");
console.log("-Training accuracy: " + trainingCorrect + "/" + TRAINING_SIZE + ", " + trainingCorrect/TRAINING_SIZE*100 + "%");
console.log("-Test accuracy: " + testCorrect + "/" + TEST_SIZE + ", " + testCorrect/TEST_SIZE*100 + "%");
