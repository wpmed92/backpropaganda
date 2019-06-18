var mathUtil = require("./util.js");

class SingleLayerPerceptron {
    constructor(neuronCount) {
        this.neuronCount = neuronCount;
        this.weights = [];
        this.input = [];
        this.weightHistory = [];

        for (let i = 0; i < neuronCount; i++) {
            this.weights.push(Math.random(0, 1));
        }

        this.weightHistory.push(this.weights.slice());
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
                this.loadInput(input);

                //Activate
                let output = this.activate();

                //Error calc
                let expectedOutput = trainOutput[j];
                let error = (output - expectedOutput) * (output - expectedOutput);

                if (i%3 == 0) {
                    console.log("Error: " + error);
                }
        
                //Gradient calc
                for (let k = 0; k < this.neuronCount; k++) {
                    let gradient = 2*(output - expectedOutput)*mathUtil.sigmaDeriv(output)*input[k];
                    deltas[k][j] = gradient;
                }
            }
        
            //Avaraging gradients
            let avgDelta = [];
        
            for (let i = 0; i < this.neuronCount; i++) {
                let avg = 0;
        
                for (let j = 0; j < trainData.length; j++) {
                    avg += deltas[i][j];
                }
        
                avg /= trainData.length;
                avgDelta[i] = avg;
            }

            this.updateWeights(avgDelta, learnRate);
        }
    }

    loadInput(input) {
        this.input = input;
    }

    updateWeights(deltas, lr) {
        for (let i = 0; i < deltas.length; i++) {
            this.weights[i] -= deltas[i] * lr;
        }

        this.weightHistory.push(this.weights.slice());
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