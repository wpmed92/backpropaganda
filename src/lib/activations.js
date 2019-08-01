class Activation {
  constructor(type) {
    this.type = type;
  }

  act() {
    throw new Error("method 'act' must be implemented in an Activation subclass.");
  }

  deriv() {
    throw new Error("method 'act' must be implemented in an Activation subclass.");
  }

  static print() {
    throw new Error("method 'print' must be implemented in an Activation subclass.");
  }
}

class ReLU extends Activation {
  constructor() {
    super("relu");
  }

  act(x) {
    return (x > 0) ? x : 0;
  }

  deriv(x) {
    return (x > 0) ? 1 : 0;
  }

  static print() {
    console.log(
    "ReLU activation function.\n" +
    "\n" + 
    "Activation:\n" +
    "-----------\n" +
    "𝑓(𝑥)={ 0 if 𝑥 <= 0 \n" + 
    "       x if 𝑥 > 0 }\n" +
    "\n" +
    "Derivation:\n" +
    "-----------\n" +
    "𝑓'(𝑥)={ 0 if 𝑥 <= 0 \n" + 
    "       1 if 𝑥 > 0 }\n"
    );
  }
}

class LeakyReLU extends Activation {
  constructor(leak) {
    super("leakyRelu");
    this.leak = leak;
  }

  act(x) {
    return (x > 0) ? x : x*this.leak;
  }

  deriv(x) {
    return (x > 0) ? 1 : this.leak;
  }

  static print() {
    console.log(
    "Leaky ReLU activation function.\n" +
    "\n" + 
    "Activation:\n" +
    "-----------\n" +
    "Same as ReLU, but enable a small gradient 'a' if x < 0\n" + 
    "𝑓(𝑥)={ax if 𝑥 <= 0 \n" + 
    "       x if 𝑥 > 0 }\n" +
    "\n" +
    "Derivation:\n" +
    "-----------\n" +
    "𝑓'(𝑥)={ a if 𝑥 <= 0 \n" + 
    "        1 if 𝑥 > 0 }\n"
    );
  }
}

class Sigmoid extends Activation {
  constructor() {
    super("sigmoid");
  }

  act(x) {
    return 1/(1 + Math.pow(Math.E, -x));
  }

  deriv(x) {
    return this.act(x) * (1 - this.act(x));
  }

  static print() {
    console.log(
      "Sigmoid activation function.\n" +
      "\n" + 
      "Activation:\n" +
      "-----------\n" +
      "𝑓(𝑥)=1/(1+e^(-x)) \n" + 
      "\n" +
      "Derivation:\n" +
      "-----------\n" +
      "𝑓'(𝑥)= 𝑓(𝑥) * (1 - 𝑓(𝑥)) \n" +
      "");
  }
}


class Tanh extends Activation {
    constructor() {
      super("tanh");
    }

    act(x) {
      return (Math.pow(Math.E, 2*x) - 1) / (Math.pow(Math.E, 2*x) + 1);
    }

    deriv(x) {
      return 1 - this.act(x) * this.act(x);
    }

    static print() {
      console.log("TODO");
    }
}

module.exports = {
  relu: ReLU,
  leakyRelu: LeakyReLU,
  sigmoid: Sigmoid,
  tanh: Tanh
}