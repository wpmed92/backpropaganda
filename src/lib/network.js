var util = require("./util");
var Layer = require("./layer");
var fs = require("fs");
var activations = require("./activations");

class Network {
    constructor() {
      this.layers =[];
      this.input = [];
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
          const randomFactor = 1/Math.sqrt(prevLayer.numNeurons);

          for (let j = 0; j < layer.numNeurons; j++) {
            let row = [];
            biases.push(0);

            for (let k = 0; k < prevLayer.numNeurons; k++) {
              row.push(util.randomInRange(-randomFactor, randomFactor));
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

    load(filename) {
      var net = JSON.parse(fs.readFileSync("nets/" + filename + ".json", 'utf8'));
      this.layers = [];
      
      for (let i = 0; i < net.layers.length; i++) {
        let layerObj = net.layers[i];
        
        if (i > 0) {
          layerObj.activationFunction = Object.assign(new activations[layerObj.activationFunction.type], layerObj.activationFunction);
        }

        let layer = Object.assign(new Layer, net.layers[i]);
        this.layers.push(layer);
      }
    }

    save(filename) {
      let layers = this.layers.map(layer => { 
          return { 
            numNeurons: layer.numNeurons,
            weights: layer.weights, 
            biases: layer.biases,
            activationFunction: layer.activationFunction
          }
        }
      );

      let model = {
        layers: layers
      };

      if (!fs.existsSync('nets/')) {
        fs.mkdirSync('nets/');
      }

      fs.writeFile('nets/' + filename + ".json", JSON.stringify(model), function(err) {
        if (err) {
          throw "Error saving network '" + filename + ".json'.";
        }

        console.log("Network '" + filename + ".json' successfully saved.")
      });
    }

    layout() {
      let networkStructure = "Network: ";
      let weightStructure = "Weight shapes: ";

      for (let i = 0; i < this.layers.length; i++) {
        let layer = this.layers[i];
        networkStructure += layer.numNeurons + ((i > 0) ? "(" + layer.activationFunction.type + ")" : "") + ((i < this.layers.length - 1) ? " -> " : "");
        weightStructure += ((i == 0) ? "(input layer, no weights)" : this.layers[i].numNeurons + "x" + this.layers[i-1].numNeurons) + ((i < this.layers.length - 1) ? " -> " : "");
      }

      console.log(networkStructure + "\n" + weightStructure);
    }

    backprop(expectedOutput, learnRate) {
      //First equation: (aL - y) o sigma'(zL)
      let outputLayer = this.layers[this.layers.length-1];
      let actualExpectedDif = util.vecSub(outputLayer.activations, expectedOutput);
      let activationDeriv = [];

      for (let j = 0; j < outputLayer.weightedInputs.length; j++) {
        let deriv = outputLayer.activationFunction.deriv(outputLayer.weightedInputs[j]);
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
          let deriv = curLayer.activationFunction.deriv(curLayer.weightedInputs[j]);
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

    train(trainData, trainingSize, trainIterations, learnRate, miniBatchSize) {
      for (let i = 0; i < trainIterations; i++) {
        for (let j = 0; j < trainingSize; j++) {
          let input = trainData[j].input;
          let output = trainData[j].output;

          //Forward pass
          this.loadInput(input);
          this.activate();

          //Propagate backward
          this.backprop(output, learnRate);

          if (j%miniBatchSize != 0) {
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