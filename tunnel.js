import "./style.css"
import { gsap } from "gsap"

import { Rendering } from "./rendering"

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

import { palettes, sinPalettes } from "./palettes";

let paletteKey = "orange"
let palette = palettes[paletteKey]
let sinPalette = sinPalettes[paletteKey]

// setting up
let rendering = new Rendering(document.querySelector("#canvas"), palette)
rendering.camera.position.y = 0.1;
rendering.camera.position.z = 0;

let controls = new OrbitControls(rendering.camera, rendering.canvas)
controls.enableRotate = true

let uTime = { value: 0 };

// Init
let radius = 2 / 3;
let rings = 40;
let segments = 32;
let totalInstances = rings * segments;

let geometry = new THREE.ConeGeometry(radius, 1, 8, 2);
let instancedGeometry = (new THREE.InstancedBufferGeometry()).copy(geometry);
instancedGeometry.instanceCount = totalInstances;

let aInstance = new Float32Array(totalInstances * 2);
let i = 0;
for (let ringI = 0; ringI < rings; ringI++) {
  for (let segmentI = 0; segmentI < segments; segmentI++) {
    let angle = segmentI / segments; // range from 0 to 1
    aInstance [i] = angle;
    aInstance[i+1] = ringI;
    i+= 2;
  }
}
instancedGeometry.setAttribute("aInstance", new THREE.InstancedBufferAttribute(aInstance, 2, false));

let vertexShader = glsl`
  #define PI 3.141592653589793
  uniform float uTime;
  attribute vec2 aInstance;

  varying vec2 vUv;
  varying float vDepth;
  varying float vAngle;

  mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;

    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
          oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
          oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
          0.0,                                0.0,                                0.0,                                1.0);
  }

  vec3 rotate(vec3 v, vec3 axis, float angle) {
    mat4 m = rotationMatrix(axis, angle);
    return (m * vec4(v, 1.0)).xyz;
  }

  void main () {
    vec3 transformed = position;
    float ringIndex = aInstance.y;
    float loop = 80.0;
    float zPos = mod(ringIndex * 2. - uTime * 15., loop);

    //float angle = aInstance.x;
    float angle = -mod(aInstance.x + uTime * 0.1 + zPos * 0.01, 1.); // shift the whole thing
    float radius = 4.5 + sin(zPos* 0.1 + angle * PI * 2. + uTime * 1.5  ) * 2.;
    vec2 ringPos = vec2(
      cos(angle * PI * 2.),
      sin(angle * PI * 2.)
    ) * radius;

    transformed.y += -0.5;
    transformed.y *= 1.2 + sin(angle * PI * 6. + zPos * 0.28) * 0.6; // wobble
    transformed.y += 0.5;

    transformed.y += 0.5;
    transformed.y *= 2.;
    transformed.y += -0.5;

    transformed = rotate(transformed, vec3(0., 0., 1.), -PI * 0.5);
    transformed = rotate(transformed, vec3(0., 1., 0.), angle * PI * 2.);

    transformed.xz += ringPos;
    transformed.y += -zPos;

    vDepth = zPos / loop;
    vAngle = angle;
    vUv = uv;
    if(position.y > 0.4999){
      vUv.y = 1.;
    }
    if(position.y < -0.4999){
      vUv.y = 0.;
    }
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.);
  }
`

let fragmentShader = glsl`
  #define PI 3.141592653589793

  varying vec2 vUv;
  varying float vDepth;
  uniform float uTime;
  varying float vAngle;

  vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ){
    return a + b*cos(6.28318*(c*t+d));
  }

  uniform vec3 uBackground;
  uniform vec3 uPalette0;
  uniform vec3 uPalette1;
  uniform vec3 uPalette2;
  uniform vec3 uPalette3;
  uniform float uPaletteOffset;

  void main () {
    vec3 color = vec3(0.);
    color = vec3(vUv.y);
    vec3 colorPalette = palette(vUv.y * 1. + vDepth * 4. + uPaletteOffset + uTime, uPalette0, uPalette1, uPalette2, uPalette3);
    color = colorPalette;
    float mixVal = vDepth + vAngle;
    color = mix(colorPalette,uBackground, cos(mixVal * PI * (4.) + uTime * 2.)); // spiral!
    color = mix(color, uBackground, vDepth);
    gl_FragColor = vec4(color, 1.);
  }
`


let material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uTime: uTime,
    uBackground: { value: palette.BG },
    uPalette0: { value: sinPalette.c0 },
    uPalette1: { value: sinPalette.c1 },
    uPalette2: { value: sinPalette.c2 },
    uPalette3: { value: sinPalette.c3 },
    uPaletteOffset: { value: sinPalette.offset },
  }
});

let mesh = new THREE.Mesh(instancedGeometry, material);
mesh.frustumCulled = false;
rendering.scene.add(mesh)


// Events

const tick = (t)=>{
  uTime.value = t
  rendering.render()
}

gsap.ticker.add(tick)
