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

  const createGrid = () => {
    const points = [];
    const count = 100;

    let c = Array(count+1).fill(0).map(() => Array(count+1).fill(0));
    c[count/2][1] = 1;
    for (let y = 1; y < count; y++) {
        for (let x = 2; x < count-1; x++) {
            if ((c[x-1][y] == 0) && (c[x][y] == 1) && (c[x+1][y] == 1)) {
                c[x][y+1] = 1;
            }
            if ((c[x-1][y] == 0) && (c[x][y] == 1) && (c[x+1][y] == 0)) {
                c[x][y+1] = 1;
            }
            if ((c[x-1][y] == 0) && (c[x][y] == 0) && (c[x+1][y] == 1)) {
                c[x][y+1] = 1;
            }
            if ((c[x-1][y] == 1) && (c[x][y] == 0) && (c[x+1][y] == 0)) {
                c[x][y+1] = 1;
            }
        }
    }
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count-1);
        const v = count <= 1 ? 0.5 : y / (count-1);
        const radius = 0.003;
        const circleColor = c[x][y] == 1 ? palette[1] : palette[4];
        points.push({
          color: circleColor,
          position: [u,v],
          radius: radius,
          rotation: 0,
        });
      }
    }
    return points;
  }

  const points = createGrid()
  const margin = 200;

  return ({ context, width, height }) => {
    context.fillStyle = palette[0];
    context.fillRect(0, 0, width, height);
    //context.rotate(Math.PI / 2);

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

      context.beginPath();
      context.arc(x, y, radius * width, 0, Math.PI + (Math.random() * Math.PI), false);
      context.fillStyle = color;
      context.lineWidth = 2
      context.fill();
    })
    //context.rotate(-Math.PI / 2);
  };
};

canvasSketch(sketch, settings);
