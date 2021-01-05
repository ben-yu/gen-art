const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const { lerp } = require('canvas-sketch-util/math');
const palettes = require('nice-color-palettes');
import { Polygon } from './polygon'

const settings = {
  dimensions: [ 2048, 2048 ]
};

const recursiveSubdivision = function({polygons, iterations}) {
    let subdivisions = [];

    polygons.forEach(polygon => {
        subdivisions.push(...polygon.subdivide());
    });

    if(iterations <= 1) {
        return subdivisions;
    } else {
        return recursiveSubdivision({polygons: subdivisions, iterations: iterations - 1});
    }
}

const regularPolygon = function({center, radius, sides}) {
    let vertices = [];
    let angle = 2 * Math.PI / sides;
    
    for (let i = 0; i < sides; i++) {
        vertices.push({
            x: center.x + radius * Math.cos(i * angle), 
            y: center.y + radius * Math.sin(i * angle)
        });
    }

    return vertices;
}

const sketch = () => {
  const colorCount = random.rangeFloor(1, 6)
  const palette = random.shuffle(random.pick(palettes)).slice(0, colorCount);


  return ({ context, width, height }) => {
    context.fillStyle = random.pick(palette);
    context.fillRect(0, 0, width, height);

    const polygon = new Polygon({
        vertices: regularPolygon({center: {x: width/2, y: height/2}, radius: 1000, sides: 7})
    });

    const subdivisions = recursiveSubdivision({polygons: [polygon], iterations: 4});
    
    const baseColor = random.pick(palette);
    const highlightColor = random.pick(palette);


    subdivisions.forEach((polygon, index) => {
        //let color = paper.Color.random();
        context.beginPath();
        context.moveTo(polygon.vertices[0].x, polygon.vertices[0].y)
        polygon.vertices.forEach((vertex, index) => {
            if (index >= 1) {
                context.lineTo(vertex.x, vertex.y) 
            }
        });
        //path.strokeWidth = 1;
        if(index % 2 == 0) {
            context.fillStyle = baseColor;
        } else {
            context.fillStyle = highlightColor;
        }
        context.fill()
        //path.strokeColor = 'black';
        //path.fillColor = color;
        //path.closed = true;
    });

  };
};

canvasSketch(sketch, settings);
