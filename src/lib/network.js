var util = require("./util");

class Network {
    constructor() {
      this.layers =[];
      this.input = [];
      this.avarageBiasDeltas = [];
      this.avarageWeightDeltas = [];
    }
    
    addLayer(layer) {
      this.layers.push(layer);
    }
    
    setup() {
      for (let i = 1; i < this.layers.length; i++) {
          let layer = this.layers[i];
          let prevLayer = this.layers[i-1];
          let weights = [];
          let biases = [];

          for (let j = 0; j < layer.numNeurons; j++) {
            let row = [];
            biases.push(0);

            for (let k = 0; k < prevLayer.numNeurons; k++) {
              row.push(Math.random()*0.01);
            }
            
            weights.push(row);
          }
          
          layer.setBiases(biases);
          layer.setWeights(weights);
      }
    }
    
    loadInput(inputData) {
      this.input = inputData;
    }
    
    activate() {
      this.layers[0].loadInput(this.input);
      
      for (let i = 1; i < this.layers.length; i++) {
        let layer = this.layers[i];
        let prevLayer = this.layers[i-1];
        let inp = (i == 1) ? prevLayer.input : prevLayer.activations;
        layer.loadInput(inp);
        layer.activate();
      }

      return this.layers[this.layers.length-1].activations;
    }

    backprop(expectedOutput, learnRate) {
      //First equation: (aL - y) o sigma'(zL)
      let outputLayer = this.layers[this.layers.length-1];
      let actualExpectedDif = util.vecSub(outputLayer.activations, expectedOutput);
      let activationDeriv = [];

      for (let j = 0; j < outputLayer.weightedInputs.length; j++) {
        let deriv = util.sigmaDeriv(outputLayer.weightedInputs[j]);
        activationDeriv.push(deriv);
      }

      let errors = util.hadamard(actualExpectedDif, activationDeriv);
      outputLayer.setErrors(errors);

      for (let i = this.layers.length - 2; i > 0; i--) {
        let nextLayer = this.layers[i+1];
        let curLayer = this.layers[i];

        //Second equation: ((wL+1)T*dL+1) o sigma'(zL)
        let weightedErrors = [];
        let activationDeriv = [];
        let nextLayerWeightTranspose = util.matTranspose(nextLayer.weights);

        //Error calc
        for (let j = 0; j < nextLayerWeightTranspose.length; j++) {
          let weightedError = 0;

          for (let k = 0; k < nextLayerWeightTranspose[j].length; k++) {
            weightedError += nextLayerWeightTranspose[j][k] * nextLayer.errors[k];
          }

          weightedErrors.push(weightedError);
        }

        //Activation deriv
        for (let j = 0; j < curLayer.weightedInputs.length; j++) {
          let deriv = util.sigmaDeriv(curLayer.weightedInputs[j]);
          activationDeriv.push(deriv);
        }

        let errors = util.hadamard(weightedErrors, activationDeriv);
        curLayer.setErrors(errors);
      }


      //Save weights and biases
      for (let i = 1; i < this.layers.length; i++) {
        let layer = this.layers[i];
        let prevLayer = this.layers[i-1];
        let biasDeltas = [];
        let weightDeltas = [];

        for (let j = 0; j < layer.weights.length; j++) {
          biasDeltas.push(layer.errors[j]*learnRate);
          let row = [];

          for (let k = 0; k < layer.weights[j].length; k++) {
            let prevLayerActivations = (i == 1) ? prevLayer.input[k] : prevLayer.activations[k]; 
            row.push(prevLayerActivations*layer.errors[j]*learnRate);
          }

          weightDeltas.push(row);
        }

        layer.avarageBiasDeltas.push(biasDeltas);
        layer.avarageWeightDeltas.push(weightDeltas);
      }
    }

    train(trainData, trainingSize, trainIterations, learnRate) {
      for (let i = 0; i < trainIterations; i++) {
        for (let j = 0; j < trainingSize; j++) {
          let input = trainData[j].input;
          let output = trainData[j].output;

          //Forward pass
          this.loadInput(input);
          this.activate();

          //Propagate backward
          this.backprop(output, learnRate);

          if (j%10 != 0) {
            continue;
          }

          //Weight and bias updates
          for (let k = 1; k < this.layers.length; k++) {
            let layer = this.layers[k];
            let avarageWeightDeltas = util.genMatrix(layer.weights.length, layer.weights[0].length);
            let avarageBiasDeltas = [];

            for (let l = 0; l < layer.biases.length; l++) {
              avarageBiasDeltas.push(0);
            }

            //Weights
            for (let l = 0; l < layer.avarageWeightDeltas.length; l++) {
              for (let m = 0; m < layer.avarageWeightDeltas[l].length; m++) {
                for (let n = 0; n < layer.avarageWeightDeltas[l][m].length; n++) {
                  avarageWeightDeltas[m][n] += layer.avarageWeightDeltas[l][m][n]/layer.avarageWeightDeltas.length;
                }
              }
            }

            //Biases
            for (let l = 0; l < layer.avarageBiasDeltas.length; l++) {
              for (let m = 0; m < layer.avarageBiasDeltas[l].length; m++) {
                avarageBiasDeltas[m] += layer.avarageBiasDeltas[l][m]/layer.avarageBiasDeltas.length;
              }
            }
            
            layer.updateWeights(avarageWeightDeltas);
            layer.updateBiases(avarageBiasDeltas);
            layer.avarageWeightDeltas = [];
            layer.avarageBiasDeltas = [];
          }
        }
      }
    }
}

module.exports = Network;