var Layer = require('./lib/layer');
var Network = require('./lib/network');
var util = require('./lib/util');
var mnist = require('mnist');

let network = new Network();

//Build
network.addLayer(new Layer(784)); //input
network.addLayer(new Layer(30)); //hidden layer
network.addLayer(new Layer(10)); //output layer

//Init
network.setup();

//Train
var TRAINING_SIZE = 8000;
var TEST_SIZE = 100;
var trainIterations = 10
var learningRate = 5;
var set = mnist.set(TRAINING_SIZE, TEST_SIZE);
network.train(set.training, TRAINING_SIZE, trainIterations, learningRate);

//Evaluate
let correct = 0;

for (let i = 0; i < TEST_SIZE; i++) {
    network.loadInput(set.test[i].input);
    let test = network.activate();

    if (util.argMax(test) == util.argMax(set.test[i].output)) {
        correct++;
    }
}

console.log("---Net report---")
console.log("-trainIterations: " + trainIterations);
console.log("-learningRate: " + learningRate);
console.log("-training data size: " + TRAINING_SIZE);
console.log("-test data size: " + TEST_SIZE);
console.log("------------------");
console.log("-MNIST network accuracy: " + correct/TEST_SIZE*100 + "%");