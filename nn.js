class NeuralNetwork {
  constructor(input_nodes, hidden_nodes, output_nodes, genes) { //Number of input, hidden and output nodes.
    this.input_nodes = input_nodes;
    this.hidden_nodes = hidden_nodes;
    this.output_nodes = output_nodes;
    //Give random weights:
    if (typeof genes === 'undefined') {
      this.input_bias = tf.randomNormal([1, this.hidden_nodes]);
      this.output_bias = tf.randomNormal([1, this.output_nodes]);
      this.input_weights = tf.add(tf.randomNormal([this.input_nodes, this.hidden_nodes]), this.input_bias);
      this.output_weights = tf.add(tf.randomNormal([this.hidden_nodes, this.output_nodes]), this.output_bias);
    } else {
      this.input_bias = tf.tensor(genes[2], [1, this.hidden_nodes]);
      this.output_bias = tf.tensor(genes[3], [1, this.output_nodes]);
      this.input_weights = tf.add(tf.tensor(genes[0], [this.input_nodes, this.hidden_nodes]), this.input_bias);
      this.output_weights = tf.add(tf.tensor(genes[1], [this.hidden_nodes, this.output_nodes]), this.output_bias);

    }
  }

  //TODO: add bias?
  predict(input_array) {
    let output;
    tf.tidy(() => {
      let input_layer = tf.tensor(input_array, [1, this.input_nodes]);
      let hidden_layer = input_layer.matMul(this.input_weights).relu();
      let output_layer = hidden_layer.matMul(this.output_weights).relu();
      output = output_layer.dataSync();
    });
    return output;
  }

  clone() {
    let clonie = new NeuralNetwork(this.input_nodes, this.hidden_nodes, this.output_nodes);
    clonie.dispose();
    clonie.input_weights = tf.clone(this.input_weights);
    clonie.output_weights = tf.clone(this.output_weights);
    return clonie;
  }

  dispose() {
    this.input_weights.dispose();
    this.output_weights.dispose();
  }
}