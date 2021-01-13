const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const { lerp } = require('canvas-sketch-util/math');
const palettes = require('nice-color-palettes');

const settings = {
  dimensions: [ 2048, 2048 ],
  animate: true,
  duration: 10,
  fps: 30
};

const sketch = () => {
  const colorCount = random.rangeFloor(1, 6)
  const palette = random.shuffle(random.pick(palettes)).slice(0, colorCount);
  //random.setSeed(123);
  let x = 0, y = 0;
  
  function update(context, width, height, time) {

    let nextX, nextY;
    let r = Math.random();
    let color;

    let a1 = 0.16 + ((time-5) % 5)/20.0
    let b1 = 0.85 + ((time-5) % 5)/20.0
    let b2 = 0.04 + ((time-5) % 5)/20.0

    //console.log(time)

    if (r < 0.01) {
        nextX =  0;
        nextY =  a1 * y;
        color = palette[1]
    } else if (r < 0.86) {
        nextX =  b1 * x + b2 * y;
        nextY = -0.04 * x + 0.85 * y + 1.6;
        color = palette[1]
    } else if (r < 0.93) {
        nextX =  0.20 * x - 0.26 * y;
        nextY =  0.23 * x + 0.22 * y + 1.6;
        color = palette[2]
    } else {
        nextX = -0.15 * x + 0.28 * y;
        nextY =  0.26 * x + 0.24 * y + 0.44;
        color = palette[2]
    }

    // Scaling and positioning
    let plotX = width * (x + 3) / 6;
    let plotY = height - height * ((y + 2) / 14);

    drawFilledCircle(context, plotX, plotY, 5, color);

    x = nextX;
    y = nextY;
}
const drawFilledCircle = (context, centerX, centerY, radius, color) => {
    context.beginPath();
    context.fillStyle = color;
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, true);
    context.fill();
};

  const margin = 200;

  return ({ context, width, height, time }) => {
    context.fillStyle = palette[0];
    context.fillRect(0, 0, width, height);
    //for(j=0; j < 10; j++) {
        for(i=0; i < 10000; i++) {
            update(context, width, height, time);
        }
    //    context.rotate(-Math.PI/7)
    //}
  };
};

canvasSketch(sketch, settings);
