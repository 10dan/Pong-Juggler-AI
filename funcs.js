function trainEpoch() {
  let avScore = 0;
  score = 0;
  cyclesLeft = maxCycles;
  x = width / 2;
  for (let h = 0; h < numBalls; h++) {
    balls_array[h].reset();
  }
  while (stored.length <= rounds) {
    if (cyclesLeft > 0) {
      move();
      for (let i = 0; i < numBalls; i++) {
        balls_array[i].move();
      }
      cyclesLeft--;
    } else {
      avScore += score;
      cyclesLeft = maxCycles;
      stored.push([score, nn]);
      score = 0;
      if (sorted.length > 0) {
        nn = new NeuralNetwork(numInputNodes, numHiddenNodes, numOutputNodes, makeGenes());
      } else {
        nn = new NeuralNetwork(numInputNodes, numHiddenNodes, numOutputNodes);
      }
      x = width / 2;
      y = height - 20;
    }
  }

  //Sort the stored list into sorted.
  sorted = [];
  for (let j = 0; j < rounds; j++) {
    let max = -10000;
    let maxi = 0;
    for (let i = 0; i < stored.length; i++) {
      if (stored[i][0] > max) {
        max = stored[i][0];
        maxi = i;
      }
    }
    let temp = Object.assign({}, stored[maxi]);
    stored.splice(maxi, 1);
    sorted.push(temp);
  }

  //Calc average score and update the nn with new genes.
  avScore /= rounds;
  print(avScore);
  let genes = makeGenes();
  nn.input_weights = tf.tensor(genes[0], [nn.input_nodes, nn.hidden_nodes]);
  nn.output_weights = tf.tensor(genes[1], [nn.hidden_nodes, nn.output_nodes]);
  training = false;
}



function makeGenes() {
  let pop = 2;
  let rg = floor(random(pop));
  let rg2 = floor(random(pop));
  let gene_in_final = [];
  let gene_in_bias = [];
  let gene_out_final = [];
  let gene_out_bias = [];

  let gene_in1 = sorted[rg][1].input_weights.dataSync();
  let gene_in2 = sorted[rg2][1].input_weights.dataSync();
  let gene_in_bias1 = sorted[rg][1].input_bias.dataSync();
  let gene_in_bias2 = sorted[rg2][1].input_bias.dataSync();
  let gene_out1 = sorted[rg][1].output_weights.dataSync();
  let gene_out2 = sorted[rg2][1].output_weights.dataSync();
  let gene_out_bias1 = sorted[rg][1].output_bias.dataSync();
  let gene_out_bias2 = sorted[rg2][1].output_bias.dataSync();

  for (let i = 0; i < gene_in1.length; i++) {
    let r = random(100);
    if (r < 0.5) {
      gene_in_final.push(random(-2, 2));
    } else {
      if (floor(r) % 2 == 0) {
        gene_in_final.push(gene_in1[i]);
      } else {
        gene_in_final.push(gene_in2[i]);
      }
    }
  }

  for (let i = 0; i < gene_in_bias1.length; i++) {
    let r = random(100);
    if (r < 0.5) {
      gene_in_bias.push(random(-2, 2));
    } else {
      if (floor(r) % 2 == 0) {
        gene_in_bias.push(gene_in_bias1[i]);
      } else {
        gene_in_bias.push(gene_in_bias2[i]);
      }
    }
  }

  for (let i = 0; i < gene_out1.length; i++) {
    let r = random(100);
    if (r < 0.5) {
      gene_out_final.push(random(-2, 2));
    } else {
      if (floor(r) % 2 == 0) {
        gene_out_final.push(gene_out1[i]);
      } else {
        gene_out_final.push(gene_out2[i]);
      }
    }
  }

  for (let i = 0; i < gene_out_bias1.length; i++) {
    let r = random(100);
    if (r < 0.5) {
      gene_out_bias.push(random(-2, 2));
    } else {
      if (floor(r) % 2 == 0) {
        gene_out_bias.push(gene_out_bias1[i]);
      } else {
        gene_out_bias.push(gene_out_bias2[i]);
      }
    }
  }

  let genes = [gene_in_final, gene_out_final, gene_in_bias, gene_out_bias];
  return genes;
}


function move() {
  //Calculting inputs and normalising them between -2 to 2.
  let inputs = [];
  let mappedx = map(x, -100, width + 100, -2, 2);
  inputs.push(mappedx);
  for (let i = 0; i < numBalls; i++) {
    inputs.push(map(balls_array[i].x, 0, width, -2, 2));
    inputs.push(map(balls_array[i].y, 0, height, -2, 2));
    inputs.push(map(balls_array[i].xv, 0, 5, -2, 2));
    inputs.push(map(balls_array[i].yv, 0, 5, -2, 2));
  }

  let out_arr = nn.predict(inputs);
  let m = indexOfMax(out_arr)
  switch (m) {
    case 0:
      x -= moveSpeed;
      break;
    case 1:
      x--;
      break;
    case 2:
      x += moveSpeed;
      break;
    case 3:
      x++;
      break;
  }
  if ((x > width + len * 2) || (x < 0 - len * 2)) {
    x = width / 2;
  }

  //Update balls locs:
  for (let i = 0; i < numBalls; i++) {
    balls_array[i].move();
  }

}

function indexOfMax(arr) {
  if (arr.length === 0) {
    return -1;
  }

  var max = arr[0];
  var maxIndex = 0;

  for (var i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      maxIndex = i;
      max = arr[i];
    }
  }

  return maxIndex;
}