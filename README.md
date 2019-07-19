# backpropaganda
backpropaganda is a JavaScript neural network framework for educational purposes. You can build multi layer feed-forward neural
networks with it, and study how they work at a low-level. There are many different ways of learning how neural networks work, and how to
use them, the most common is to start with [TensorFlow](https://github.com/tensorflow/tensorflow). While this might be suitable for most people there are some developers who
like to build things from scratch to really understand how they work. If you are one of them, this project is for you.

### Table of Contents
**[Installation](#installation)**<br>
**[Solving the XOR problem](#solving-the-xor-problem)**<br>
**[Recognizing handwritten digits](#recognizing-handwritten-digits)**<br>
**[Contribution](#contribution)**<br>

## Installation

Clone this repo:

`git clone https://github.com/wpmed92/backpropaganda.git`

Use the library and experiment.

## Solving the XOR problem

To run the example type the following in the terminal.

`node src/multi-layer-xor-train.js`

### Code walkthrough:

Require the libraries.

```javascript
var Layer = require('./lib/layer');
var Network = require('./lib/network');
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


## Recognizing handwritten digits

For this example I used a [JavaScript version of the mnist-dataset](https://github.com/cazala/mnist)
The network is composed of 3 layers, with dimensions of 784, 30 and 10 respectively.
Feel free to play around with other architectures, and see if they are better/worse than this.
To run the example type the following in the terminal.

`node src/multi-layer-mnist-train.js`

Require the libraries.

```javascript
var Layer = require('./lib/layer');
var Network = require('./lib/network');
var util = require('./lib/util');
var mnist = require('mnist');
```

Create a network instance.

```javascript
let network = new Network();
```

Add layers to the network.

```javascript
network.addLayer(new Layer(784)); //input
network.addLayer(new Layer(30)); //hidden layer
network.addLayer(new Layer(10)); //output layer
```

Initialize the network weights and biases.

```javascript
network.setup();
```

Train the network. 
Try increasing/decreasing `trainIterations` `learningRate` and `miniBatchSize`, and see how they change the training process. All the training logic is inside `network.train`.

```javascript
var TRAINING_SIZE = 8000;
var TEST_SIZE = 300;
var trainIterations = 10
var learningRate = 5;
var miniBatchSize = 10;
var set = mnist.set(TRAINING_SIZE, TEST_SIZE);
network.train(set.training, TRAINING_SIZE, trainIterations, learningRate, miniBatchSize);
```

Evaluate how effective your training was on both the training dataset and on a test dataset the network hasn't previously seen.

```javascript
let testCorrect = 0;
let trainingCorrect = 0;

//Training
for (let i = 0; i < TRAINING_SIZE; i++) {
    network.loadInput(set.training[i].input);
    let test = network.activate();

    if (util.argMax(test) == util.argMax(set.training[i].output)) {
        trainingCorrect++;
    }
}

//Test
for (let i = 0; i < TEST_SIZE; i++) {
    network.loadInput(set.test[i].input);
    let test = network.activate();

    if (util.argMax(test) == util.argMax(set.test[i].output)) {
        testCorrect++;
    }
}
```

Optional: save the network.

```javascript
network.save("mnist-net-test");
```

Print out some stats about the training and evaluation.

```javascript
console.log("---Net report---")
console.log("-dataset: MNIST");
console.log("-trainIterations: " + trainIterations);
console.log("-learningRate: " + learningRate);
console.log("-training data size: " + TRAINING_SIZE);
console.log("-test data size: " + TEST_SIZE);
console.log("------------------");
console.log("-Training accuracy: " + trainingCorrect + "/" + TRAINING_SIZE + ", " + trainingCorrect/TRAINING_SIZE*100 + "%");
console.log("-Test accuracy: " + testCorrect + "/" + TEST_SIZE + ", " + testCorrect/TEST_SIZE*100 + "%");
```

## Weight visualization

There is an experimental weight visualizer, which saves a given weight matrix into an image.

```javascript
let weightVisualizer = new WeightVisualizer(weights, VISUALIZER_MODE.RAINBOW);
weightVisualizer.generateImage(id);
```

Here is an example gif created from weight images saved during the training process. See how the trained digit (a "1") starts taking shape.

![Weight evolution](https://github.com/wpmed92/backpropaganda/blob/master/weight_evolution.gif)

## Contribution

Feel free to add fixes, improvements or new features to the codebase.
Here are some features I'd like to add:

* More activation functions. Currently sigmoid is supported.
* More cost functions. Currently Mean Square Error is supported.
* Draw things in CLI: learning curves, stats
* Use backpropaganda as a CLI tool
