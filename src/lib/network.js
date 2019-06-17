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
          
          for (let j = 0; j < layer.numNeurons; j++) {
            let row = [];
          
            for (let k = 0; k < prevLayer.numNeurons; k++) {
              row.push(Math.random(0, 1));
            }
            
            weights.push(row);
          }
          
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
        layer.loadInput(prevLayer.output);
        layer.activate();
      }
    }
}

module.exports = Network;