class SingleLayerPerceptron {
    constructor(neuronCount) {
        this.neuronCount = neuronCount;
        this.weights = [];
        this.inputs = [];

        for (let i = 0; i < neuronCount; i++) {
            this.weights.push(Math.random(0, 1));
        }
    }

    loadInput(inputs) {
        this.inputs = inputs;
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

        for (let i = 0; i < this.inputs.length; i++) {
            sum += this.inputs[i] * this.weights[i];    
        }

        return 1/(1+(Math.pow(Math.E, -sum)));
    }
}

module.exports = SingleLayerPerceptron;