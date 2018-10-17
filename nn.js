function sigmoid(a) {
  return 1 / (1 + Math.pow(Math.E, -a));
}

class NeuralNetwork {
  constructor(input, hidden, output) {
    this.input_nodes = input;
    this.hidden_nodes = hidden;
    this.output_nodes = output;
    this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
    this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
    this.weights_ih.randomize(2, 1);
    this.weights_ho.randomize(2, 1);
    this.bias_h = new Matrix(this.hidden_nodes, 1);
    this.bias_o = new Matrix(this.output_nodes, 1);
    this.bias_h.randomize(2, 1);
    this.bias_o.randomize(2, 1);
    //this.weights_ih.print();
  }

  //relu
  //multiple layers

  feedforward(input_array) {
    let inputs = Matrix.fromArray(input_array);
    //inputs.print();
    let hidden = Matrix.multiply(this.weights_ih, inputs);
    // this.weights_ho.print();
    hidden.add(this.bias_h);
    hidden.map(sigmoid);
    let output = Matrix.multiply(this.weights_ho, hidden);
    output.add(this.bias_o);
    output.map(sigmoid);

    return output.toArray();
  }

  train(inputs, targets) {
    let outputs = this.feedforward(inputs);
    let error = Matix.subtract(targets, outputs);
    outputs = Matrix.fromArray(outputs);
    targets = Matrix.fromArray(targets);
    let result = Matrix.subtract(targets, outputs);
  }

  inheritFrom(firstParent, secondParent) {
    this.weights_ih = Matrix.mergeMatrix(
      firstParent.weights_ih,
      secondParent.weights_ih
    );
    this.weights_ho = Matrix.mergeMatrix(
      firstParent.weights_ho,
      secondParent.weights_ho
    );
    this.bias_o = Matrix.mergeMatrix(firstParent.bias_o, secondParent.bias_o);
    this.bias_h = Matrix.mergeMatrix(firstParent.bias_h, secondParent.bias_h);

    //back propagationi, if hit b top, drop
  }

  mutate(probability) {
    //console.log(actual);
    //this.weights_ih.print();

    // console.log("MUTATING");

    //    console.log(this.weights_ih.data[0][0])
    //this.weights_ih.print();
    //    console.log("AFTER");
    //console.log(probability);
    this.weights_ih.randomSelect(probability);
    this.weights_ho.randomSelect(probability);
    this.bias_o.randomSelect(probability);
    this.bias_h.randomSelect(probability);
  }

  dump(key) {
    window.localStorage.setItem(key, JSON.stringify(this));
  }

  get(key) {
    let loaded = window.localStorage.getItem(key);
    loaded = JSON.parse(loaded);
    this.weights_ih = loaded.weights_ih;
    this.weights_ho = loaded.weights_ho;
    this.bias_h = loaded.bias_h;
    this.bias_o = loaded.bias_o;
  }

  //normalize inputs
}
