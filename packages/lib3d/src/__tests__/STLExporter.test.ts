import 'jsdom-worker';
global.fetch = require('jest-fetch-mock');

import scene2STL from '../STLExporter';
import Cube, { ICubeJSON } from '../Cube';

import * as THREE from 'three';

test('Scene - Constructor', async () => {
  const cube = new Cube({ width: 10, height: 10, depth: 10 });
  const mesh = (await cube.getMeshAsync()) as THREE.Mesh;
  scene2STL([mesh], 'test');
});