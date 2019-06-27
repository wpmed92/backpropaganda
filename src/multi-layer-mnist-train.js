var Layer = require('./lib/layer');
var Network = require('./lib/network');
var util = require('./lib/util');
var mnist = require('mnist');
var { WeightVisualizer, VISUALIZER_MODE } = require('./lib/weight-visualizer');

let network = new Network();

//Build
network.addLayer(new Layer(784)); //input
network.addLayer(new Layer(30)); //hidden layer
network.addLayer(new Layer(10)); //output layer

//Init
network.setup();

//Train
var TRAINING_SIZE = 8000;
var TEST_SIZE = 300;
var trainIterations = 10
var learningRate = 5;
var miniBatchSize = 10;
var set = mnist.set(TRAINING_SIZE, TEST_SIZE);
network.train(set.training, TRAINING_SIZE, trainIterations, learningRate, miniBatchSize);

//Evaluate
let testCorrect = 0;
let trainingCorrect = 0;

//Training
for (let i = 0; i < TRAINING_SIZE; i++) {
    network.loadInput(set.training[i].input);
    let test = network.activate();

    if (util.argMax(test) == util.argMax(set.training[i].output)) {
        trainingCorrect++;
    }
}

//Test
for (let i = 0; i < TEST_SIZE; i++) {
    network.loadInput(set.test[i].input);
    let test = network.activate();

    if (util.argMax(test) == util.argMax(set.test[i].output)) {
        testCorrect++;
    }
}

let visualTasks = [];

//Experimental visualization of hidden layer weights
/*let hiddenLayer = network.layers[1];

for (let i = 0; i < hiddenLayer.weights.length; i++) {
    (function(i) {
        let weightVisualizer = new WeightVisualizer(hiddenLayer.weights[i].slice(), VISUALIZER_MODE.RAINBOW);
        visualTasks.push(weightVisualizer.generateImage(i));
    })(i);
};

Promise.all(visualTasks).then(() => {
    console.log("Weight frames generated successfully.")
})
.catch((error) => {
    console.log("Oops, something went wrong generating weight frames: " + error);
});*/

console.log("---Net report---")
console.log("-dataset: MNIST");
console.log("-trainIterations: " + trainIterations);
console.log("-learningRate: " + learningRate);
console.log("-training data size: " + TRAINING_SIZE);
console.log("-test data size: " + TEST_SIZE);
console.log("------------------");
console.log("-Training accuracy: " + trainingCorrect + "/" + TRAINING_SIZE + ", " + trainingCorrect/TRAINING_SIZE*100 + "%");
console.log("-Test accuracy: " + testCorrect + "/" + TEST_SIZE + ", " + testCorrect/TEST_SIZE*100 + "%");