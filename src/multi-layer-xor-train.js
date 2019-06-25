var Layer = require('./lib/layer');
var Network = require('./lib/network');
var util = require('./lib/util');

let network = new Network();

//Build
network.addLayer(new Layer(2)); //input
network.addLayer(new Layer(2)); //hidden layer
network.addLayer(new Layer(1)); //output layer

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

//Init
network.setup();

//Train
var TRAINING_SIZE = 4;
var trainIterations = 10000
var learningRate = 10;
var miniBatchSize = 4;

network.train(set, TRAINING_SIZE, trainIterations, learningRate, miniBatchSize);

//Evaluate
for (let i = 0; i < TRAINING_SIZE; i++) {
    network.loadInput(set[i].input);
    let test = network.activate(); 
    console.log("Expected: " + set[i].output + ", activation: " + test);
}

