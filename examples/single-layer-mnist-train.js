var SingleLayerPerceptron = require("../lib/single-layer-perceptron");
var { WeightVisualizer, VISUALIZER_MODE } = require('../lib/weight-visualizer');
var mnist = require('mnist');

//Train
let trainData = [];
let trainOutput = [];
const SELECTED_DIGIT = 1;

//Test
let testInput = [];
let testOutput = [];

let trainIterations = 50;
let learnRate = 10;

for (let i = 0; i < 10; i++) {
    //200 samples of SELECTED_DIGIT
    if (i == SELECTED_DIGIT) {
        let inputs = mnist[i].set(100, 500).map(function(elem) { return elem.input; });
        let outputs = mnist[i].set(100, 500).map(function(elem) { return 1; });
        trainData = trainData.concat(inputs);
        trainOutput = trainOutput.concat(outputs);
    //50 samples from other digit
    } else {
        let inputs = mnist[i].set(50, 100).map(function(elem) { return elem.input; });
        let outputs = mnist[i].set(50, 100).map(function(elem) { return 0; });
        trainData = trainData.concat(inputs);
        trainOutput = trainOutput.concat(outputs);
    }
}

console.log(trainData);
let perceptron = new SingleLayerPerceptron(784);
perceptron.train(trainData, trainOutput, learnRate, trainIterations);

//Test
for (let i = 0; i < 10; i++) {
    //200 samples of "4"
    if (i == SELECTED_DIGIT) {
        let inputs = mnist[i].set(500, 900).map(function(elem) { return elem.input; });
        let outputs = mnist[i].set(500, 900).map(function(elem) { return 1; });
        testInput = testInput.concat(inputs);
        testOutput = testOutput.concat(outputs);
    //50 samples from each non "4" digits
    } else {
        let inputs = mnist[i].set(200, 250).map(function(elem) { return elem.input; });
        let outputs = mnist[i].set(200, 250).map(function(elem) { return 0; });
        testInput = testInput.concat(inputs);
        testOutput = testOutput.concat(outputs);
    }
}

let correctPositive = 0;
let correctNegative = 0;

for (let i = 0; i < testInput.length; i++) {
    perceptron.loadInput(testInput[i])
    let output = (perceptron.activate() > 0.5 ? 1 : 0);
    let expectedOutput = testOutput[i];

    if (output == expectedOutput) {
        if (expectedOutput == 1) {
            correctPositive++;
        } else {
            correctNegative++;
        }
    }
}

let sensitivity = (correctPositive / 401) * 100;
let specificity = (correctNegative / 459) * 100;

let weightVisualizer = new WeightVisualizer(perceptron.weights, VISUALIZER_MODE.RAINBOW);
weightVisualizer.generateImage(0);

//Use it to visualize weight history
/*let visualTasks = [];

for (let i = 0; i < perceptron.weightHistory.length; i++) {
    (function(i) {
        let weightVisualizer = new WeightVisualizer(perceptron.weightHistory[i].slice(), VISUALIZER_MODE.RAINBOW);
        visualTasks.push(weightVisualizer.generateImage(i));
    })(i);
};

Promise.all(visualTasks).then(() => {
    console.log("Weight frames generated successfully.")
})
.catch((error) => {
    console.log("Oops, something went wrong generating weight frames: " + error);
});*/

console.log("Network accuracy for recognizing " + SELECTED_DIGIT + ": sensitivity: " + sensitivity + "%, specificity: " + specificity + "%");

