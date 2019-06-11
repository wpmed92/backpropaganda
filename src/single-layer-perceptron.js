var mathUtil = require("./util.js");

class SingleLayerPerceptron {
    constructor(neuronCount) {
        this.neuronCount = neuronCount;
        this.weights = [];
        this.input = [];

        for (let i = 0; i < neuronCount; i++) {
            this.weights.push(Math.random(0, 1));
        }
    }

    createDeltasArray() {
        let deltas = [];
    
        for (let i = 0; i < this.neuronCount; i++) {
            deltas[i] = [];
        }
    
        return deltas;
    }

    train(trainData, trainOutput, learnRate, trainIterations) {
        let deltas = this.createDeltasArray();

        for (let i = 0; i < trainIterations; i++) {
            console.log("Train iteration " + i + "...");
        
            //Learn from train data
            for (let j = 0; j < trainData.length; j++) {
                let input = trainData[j];

                //Load input
                console.log("Input " + input.toString());
                this.loadInput(input);

                //Activate
                let output = this.activate();

                //Error calc
                let expectedOutput = trainOutput[j];
                console.log("Expected output: " + expectedOutput, "Actual output: " + output);
                let error = (output - expectedOutput) * (output - expectedOutput);
                console.log("Error: " + error);
        
                //Gradient calc
                for (let k = 0; k < 3; k++) {
                    let gradient = 2*(output - expectedOutput)*mathUtil.sigmaDeriv(output)*input[k];
                    deltas[k][j] = gradient;
                }
            }
        
            //Avaraging gradients
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
            this.updateWeights(avgDelta, learnRate);
        }
    }

    loadInput(input) {
        this.input = input;
    }

    updateWeights(deltas, lr) {
        console.log("Pre-update: " + this.weights.toString());

        for (let i = 0; i < deltas.length; i++) {
            this.weights[i] -= deltas[i] * lr;
        }

        console.log("Post-update: " + this.weights.toString());
    }

    activate() {
        let sum = 0;

        for (let i = 0; i < this.input.length; i++) {
            sum += this.input[i] * this.weights[i];    
        }

        return mathUtil.sigma(sum);
    }
}

module.exports = SingleLayerPerceptron;