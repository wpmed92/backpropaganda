var SingleLayerPerceptron = require("./lib/single-layer-perceptron");
let trainData = [[1,0,0],
                 [1,1,1],
                 [0,1,0],
                 [0,1,1],
                 [0,0,1]];

let trainOutput = [1,1,0,0,0];
let trainIterations = 1000;
let learnRate = 10;

let perceptron = new SingleLayerPerceptron(3);
perceptron.train(trainData, trainOutput, learnRate, trainIterations);

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