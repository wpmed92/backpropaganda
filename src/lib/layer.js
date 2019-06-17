var math = require('./util');

class Layer {
    constructor(numNeurons) {
        this.numNeurons = numNeurons;
        this.weights = [];
        this.input = [];
        this.output = [];
    }
    
    setWeights(weights) {
        this.weights = weights;
    }

    loadInput(input) {
        this.input = input;
    }

    activate() {
        for (let i = 0; i < this.weights.length; i++) {
            let sum = 0;

            for (let j = 0; j < this.weights[i].length; j++) {
                let weight = this.weights[i][j];
                sum += weight * this.input[j];
            }

            sum = math.sigma(sum);
            this.output.push(sum);
        }
    }
}

module.exports = Layer;