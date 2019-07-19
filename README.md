# backpropaganda
backpropaganda is a JavaScript neural network framework for educational purposes. You can build multi layer feed-forward neural
networks with it, and study how they work at a low-level. There are many different ways of learning how neural networks work, and how to
use them, the most common is to start with [TensorFlow](https://github.com/tensorflow/tensorflow). While this might be suitable for most people there are some developers who
like to build things from scratch to really understand how they work. If you are one of them, this project is for you.

## Installation

Clone this repo:

`git clone https://github.com/wpmed92/backpropaganda.git`

Use the library and experiment.

## Train a network to solve the XOR problem

To run the example type the following in the terminal.

`node src/multi-layer-xor-train.js`

### Code walkthrough:

Require the library.

```javascript
var Layer = require('./lib/layer');
var Network = require('./lib/network');
var util = require('./lib/util');
```

Create a network instance.

```javascript
let network = new Network();
```

Add layers to the network.

```javascript
network.addLayer(new Layer(2)); //input
network.addLayer(new Layer(2)); //hidden layer
network.addLayer(new Layer(1)); //output layer
```

Define the training dataset.

```javascript
var set = [
    {
        input: [1, 0],
        output: [1]
    },
    {
        input: [0, 1],
        output: [1]
    },
    {
        input: [1, 1],
        output: [0]
    },
    {
        input: [0, 0],
        output: [0]
    },
];
```

Initialize the network weights and biases.

```javascript
network.setup();
```

Train the network.

```javascript
var TRAINING_SIZE = 4;
var trainIterations = 10000
var learningRate = 10;
var miniBatchSize = 4;

network.train(set, TRAINING_SIZE, trainIterations, learningRate, miniBatchSize);
```

Evaluate how effective your training was.

```javascript
for (let i = 0; i < TRAINING_SIZE; i++) {
    network.loadInput(set[i].input);
    let test = network.activate(); 
    console.log("Expected: " + set[i].output + ", activation: " + test);
}
```

Save the network if you want. `network.save()` will create a "nets" folder (gitignored by default) in the repo, and save your networks there in JSON format.

```javascript
network.save("xor");
```

## Contribution

Feel free to add fixes, improvements or new features to the codebase.
Here are some features I'd like to add:

* More activation functions. Currently sigmoid is supported.
* More cost functions. Currently Mean Square Error is supported.
* Draw things in CLI: learning curves, stats
* Use backpropaganda as a CLI tool
