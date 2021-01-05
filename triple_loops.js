const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const { lerp } = require('canvas-sketch-util/math');
const palettes = require('nice-color-palettes');

const settings = {
  dimensions: [ 2048, 2048 ]
};

const sketch = () => {
  const colorCount = random.rangeFloor(1, 6)
  const palette = random.shuffle(random.pick(palettes)).slice(0, colorCount);
  //random.setSeed(123);

  const internalCircles = 5

  const createGrid = () => {
    const points = [];
    const count = 20;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count-1);
        const v = count <= 1 ? 0.5 : y / (count-1);
        const radius = 0.06;
        const circleColor = random.pick(palette);
        points.push({
          color: circleColor,
          position: [u,v],
          radius: radius,
          rotation: 0,
        });
        for (let z = 1; z <= internalCircles; z++) {
            const internalRadius = radius * (1-z/internalCircles)
            points.push({
                color: circleColor,
                position: [u+0.007, v+0.007],
                radius: internalRadius,
                rotation: 0,
              });
        }
      }
    }
    return points;
  }

  const points = createGrid()
  const margin = 200;
  const chars = ['◱']

  return ({ context, width, height }) => {
    context.fillStyle = random.pick(palette);
    context.fillRect(0, 0, width, height);

    points.forEach((data) => {
      const {
        color,
        position,
        radius,
        rotation
      } = data;
      const [u,v] = position;

      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      // context.beginPath();
      // context.arc(x, y, radius * width, 0, Math.PI * 2, false);
      // context.fillStyle = color;
      // context.lineWidth = 2
      // context.fill();

      context.save()
      context.fillStyle = color;
      context.font = `${radius * width}px "Helvetica"`
      context.translate(x,y);
      context.rotate(rotation);
      context.fillText(random.pick(chars), 0, 0);
      context.restore();
    })
  };
};

canvasSketch(sketch, settings);
