var math = require('./util');

class Layer {
    constructor(numNeurons, activationFunction) {
        this.numNeurons = numNeurons;
        this.weights = [];
        this.biases = [];
        this.input = [];
        this.activationFunction = activationFunction;
        this.activations = [];
        this.weightedInputs = [];
        this.errors = [];
        this.avarageBiasDeltas = [];
        this.avarageWeightDeltas = [];
    }
    
    setBiases(biases) {
        this.biases = biases;
    }

    updateBiases(deltas) {
        for (let i = 0; i < this.biases.length; i++) {
            this.biases[i] -= deltas[i];
        }
    }

    setWeights(weights) {
        this.weights = weights;
    }

    updateWeights(deltas) {
        for (let i = 0; i < this.weights.length; i++) {
            for (let j = 0; j < this.weights[i].length; j++) {
                this.weights[i][j] -= deltas[i][j];
            }
        }
    }

    setErrors(errors) {
        this.errors = errors;
    }

    loadInput(input) {
        this.input = input;
    }

    activate() {
        let output = [];
        let sums = [];

        for (let i = 0; i < this.weights.length; i++) {
            let sum = 0;

            for (let j = 0; j < this.weights[i].length; j++) {
                let weight = this.weights[i][j];
                sum += weight * this.input[j];
            }

            sum += this.biases[i];
            sums.push(sum);
            output.push(this.activationFunction.act(sum));
        }

        this.weightedInputs = sums;
        this.activations = output;
    }
}

module.exports = Layer;