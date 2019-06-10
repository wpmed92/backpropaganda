var SingleLayerPerceptron = require("./single-layer-perceptron");
var mathUtil = require("./util.js");
let perceptron = new SingleLayerPerceptron(3);
let trainData = [[1,0,0],
                 [1,1,1],
                 [0,1,0],
                 [0,1,1],
                 [0,0,1]];

let trainOutput = [1,1,0,0,0];
let trainIterations = 1000;
let deltas = createDeltasArray(3);
let learnRate = 1;

function createDeltasArray(cols) {
    let deltas = [];

    for (let i = 0; i < cols; i++) {
        deltas[i] = [];
    }

    return deltas;
}

//Train iterations
for (let i = 0; i < trainIterations; i++) {
    console.log("Train iteration " + i + "...");

    //Learn from train data
    for (let j = 0; j < trainData.length; j++) {
        let input = trainData[j];
        console.log("Input " + input.toString());
        perceptron.loadInput(input);
        let output = perceptron.activate();
        let expectedOutput = trainOutput[j];
        console.log("Expected output: " + expectedOutput, "Actual output: " + output);
        let error = (output - expectedOutput) * (output - expectedOutput);
        console.log("Error: " + error);

        for (let k = 0; k < 3; k++) {
            let gradient = 2*(output - expectedOutput)*mathUtil.sigmaDeriv(output)*input[k];
            deltas[k][j] = gradient;
        }
    }

    let avgDelta = [];

    for (let i = 0; i < 3; i++) {
        let avg = 0;

        for (let j = 0; j < trainData.length; j++) {
            avg += deltas[i][j];
        }

        avg /= trainData.length;
        avgDelta[i] = avg;
    }

    console.log("Avarage delta " + avgDelta.toString());
    perceptron.updateWeights(avgDelta, learnRate);
}

console.log("Test train data.");

//Test the model train data
for (let i = 0; i < trainData.length; i++) {
    perceptron.loadInput(trainData[i]);
    console.log("Test " + trainData[i].toString() + " expected: " + trainOutput[i] + ", test actual: " + -Math.round(-perceptron.activate()));
}

console.log("Test new data.");

//Test the model unseen data
perceptron.loadInput([1,0,1]);
console.log("Test [1,0,1] expected: 1, test actual: " + -Math.round(-perceptron.activate()));

perceptron.loadInput([1,1,0]);
console.log("Test [1,1,0] expected: 1, test actual: " + -Math.round(-perceptron.activate()));

perceptron.loadInput([0,0,0]);
console.log("Test [0,0,0] expected: 0, test actual: " + -Math.round(-perceptron.activate()));