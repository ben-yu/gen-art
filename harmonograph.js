const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const { lerp } = require('canvas-sketch-util/math');
const palettes = require('nice-color-palettes');

const settings = {
  dimensions: [ 2048, 2048 ],
  animate: true,
  fps: 30
};

const sketch = () => {
  const colorCount = random.rangeFloor(1, 6)
  const palette = random.shuffle(random.pick(palettes)).slice(0, colorCount);
  //random.setSeed(123);
  
  const points = [];
  const a1 = 450;
  const a2 = 450;
  const a3 = 450;
  const a4 = 450;
  
  const f1 = 4.00;
  const f2 = 6.00;
  const f3 = 12.00;
  const f4 = 8.00;
  
  const p1 = 9 * Math.PI / 16;
  const p2 = Math.PI / 2;
  const p3 = 5 * Math.PI / 16;
  const p4 = 5 * Math.PI / 2;
  
  const d1 = 0.0085;
  const d2 = 0;
  const d3 = 0.065;
  const d4 = 0;
  const addPoint = (width, height, t) => {
    points.push({
        x: width/2 + (a1 * Math.sin(t * f1 + p1) * Math.exp(-d1 * t)) + (a2 * Math.sin(t * f2 + p2) * Math.exp(-d2 * t)),
        y: height/2 + (a3 * Math.sin(t * f3 + p3) * Math.exp(-d3 * t)) + (a4 * Math.sin(t * f4 + p4) * Math.exp(-d4 * t)),
      })
    return points;
  }

  const margin = 200;

  return ({ context, width, height, time }) => {
    context.fillStyle = palette[0];
    context.fillRect(0, 0, width, height);
    //context.rotate(Math.PI / 2);
    addPoint(width, height, time)

    context.moveTo(width/2, height/2)
    context.beginPath();
    points.forEach((data, i) => {
        if (i > 0) {
            const {x, y} = data;
            context.lineTo(x, y);
        }
    });
    context.strokeStyle = palette[3];

    context.lineWidth = 2
    context.fill();
    context.stroke();
    //context.rotate(-Math.PI / 2);
  };
};

canvasSketch(sketch, settings);
