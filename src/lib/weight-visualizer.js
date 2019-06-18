var Jimp = require('jimp');

const VISUALIZER_MODE = {
  GRAY: "gray",
  RAINBOW: "rainbow"
}

class WeightVisualizer {
  constructor(weights, mode) {
    this.weights = weights;
    this.mode = mode;
  }

  getHexColor(i) {
    let maxLength = Math.max(...this.weights) - Math.min(...this.weights);
    let length = Math.abs((Math.min(...this.weights) - this.weights[i]));
    var i = (length * 255 / maxLength);
    let r, g, b;

    if (this.mode === VISUALIZER_MODE.RAINBOW) {
      r = Math.round(Math.sin(0.024 * i + 0) * 127 + 128);
      g = Math.round(Math.sin(0.024 * i + 2) * 127 + 128);
      b = Math.round(Math.sin(0.024 * i + 4) * 127 + 128);
    } else if (this.mode === VISUALIZER_MODE.GRAY) {
      r = i;
      g = i;
      b = i;
    }

    return Jimp.rgbaToInt(r, g, b, 255);
  }

  generateImage(i) {
    let that = this;

    return new Promise((resolve, reject) => {
      let image = new Jimp(28, 28, function (err, image) {
          if (err) {
              reject(err);
          }

          for (let i = 0; i < that.weights.length; i++) {
              let x = i % 28;
              let y = Math.floor(i / 28);
              image.setPixelColor(that.getHexColor(i), x, y);
          }

          image.write(`weights_${i}.png`, (err) => {
            if (err) {
              reject(err);
            }

            resolve();
          });
        });
    });
  }
}

module.exports = {
  WeightVisualizer,
  VISUALIZER_MODE
}