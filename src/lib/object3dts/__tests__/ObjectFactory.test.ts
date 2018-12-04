import 'jsdom-worker';
import Cube from '../Cube';
import Cylinder from '../Cylinder';
import ObjectFactory from '../ObjectFactory';
import Sphere from '../Sphere';
import Prism from '../Prism';
import ObjectsCommon from '../ObjectsCommon';
import Scene from '../Scene';
import ObjectsGroup, { IObjectsGroupJSON } from '../ObjectsGroup';
import RepetitionObject, { IRepetitionObjectJSON } from '../RepetitionObject';

const width = 10;
const height = 20;
const depth = 30;

const r0 = 4;
const r1 = 6;
const radius = 8;

const sides = 5;
const length = 3;

test('Check Cube is well created from ObjectFactory', () => {
  const object1 = new Cube({ width, height, depth });
  const json = object1.toJSON();
  const object: Cube = ObjectFactory.newFromJSON(json, new Scene()) as Cube;
  expect(object).toBeInstanceOf(Cube);
  expect((object as any).parameters.width).toBe(width);
  expect((object as any).parameters.height).toBe(height);
  expect((object as any).parameters.depth).toBe(depth);
  expect(object1.getID()).not.toEqual(object.getID());
});

test('Check Cylinder is well created from ObjectFactory', () => {
  const object1 = new Cylinder({ r0, r1, height });
  const json = object1.toJSON();
  const object: Cylinder = ObjectFactory.newFromJSON(
    json,
    new Scene(),
  ) as Cylinder;
  expect(object).toBeInstanceOf(Cylinder);
  expect((object as any).parameters.r0).toBe(r0);
  expect((object as any).parameters.height).toBe(height);
  expect((object as any).parameters.r1).toBe(r1);
  expect(object1.getID()).not.toEqual(object.getID());
});

test('Check Sphere is well created from ObjectFactory', () => {
  const object1 = new Sphere({ radius });
  const json = object1.toJSON();
  const object = ObjectFactory.newFromJSON(json, new Scene());
  expect(object).toBeInstanceOf(Sphere);
  expect((object as any).parameters.radius).toBe(radius);
  expect(object1.getID()).not.toEqual(object.getID());
});

test('Check Prism is well created from ObjectFactory', () => {
  const object1 = new Prism({ sides, length, height });
  const json = object1.toJSON();
  const object = ObjectFactory.newFromJSON(json, new Scene());
  expect(object).toBeInstanceOf(Prism);
  expect((object as any).parameters.sides).toBe(sides);
  expect((object as any).parameters.height).toBe(height);
  expect((object as any).parameters.length).toBe(length);
  expect(object1.getID()).not.toEqual(object.getID());
});

test('Check ObjectsGroup is well created from ObjectFactory', () => {
  const scene = new Scene();

  const objectCube = new Cube(
    { width, height, depth },
    [],
    ObjectsCommon.createViewOptions(),
  );

  (scene as any).addExistingObject(objectCube);

  const objectPrism = new Prism(
    { sides, length, height },
    [],
    ObjectsCommon.createViewOptions(),
  );

  (scene as any).addExistingObject(objectPrism);

  const jsonGroupAux: IObjectsGroupJSON = {
    children: [objectCube.toJSON(), objectPrism.toJSON()],
    id: '',
    type: ObjectsGroup.typeName,
    viewOptions: ObjectsCommon.createViewOptions(),
    operations: [],
  };

  const group = ObjectFactory.newFromJSON(jsonGroupAux, scene);
  expect(group).toBeInstanceOf(ObjectsGroup);
  expect((group as any).children.length).toEqual(2);
  expect((group as any).children[0].id).toEqual(objectCube.getID());
  expect((group as any).children[1].id).toEqual(objectPrism.getID());
});

test('Check ObjectsGroup rejects object not in Scene from ObjectFactory', () => {
  const scene = new Scene();

  const objectCube = new Cube({ width, height, depth });

  (scene as any).addExistingObject(objectCube);

  const objectPrism = new Prism({ sides, length, height });

  (scene as any).addExistingObject(objectPrism);

  const objectPrismAux = new Prism({ sides, length, height });

  const jsonGroupAux: IObjectsGroupJSON = {
    children: [
      objectCube.toJSON(),
      objectPrism.toJSON(),
      objectPrismAux.toJSON(),
    ],
    id: '',
    type: ObjectsGroup.typeName,
    viewOptions: ObjectsCommon.createViewOptions(),
    operations: [],
  };

  const error = () => {
    ObjectFactory.newFromJSON(jsonGroupAux, scene);
  };
  expect(error).toThrowError();
});

test('Check RepetitionObject is well created from ObjectFactory', () => {
  const scene = new Scene();

  const objectCube = new Cube({ width, height, depth });

  (scene as any).addExistingObject(objectCube);

  const jsonRepetitionAux: IRepetitionObjectJSON = {
    children: [objectCube.toJSON()],
    id: '',
    parameters: { type: 'cartesian', x: 10, y: 20, z: 30, num: 10 },
    type: RepetitionObject.typeName,
    viewOptions: ObjectsCommon.createViewOptions(),
    operations: [],
  };

  const repetition = ObjectFactory.newFromJSON(jsonRepetitionAux, scene);
  // force to compute mesh
  (repetition as any).computeMesh();
  expect(repetition).toBeInstanceOf(RepetitionObject);
  //expect((repetition.toJSON().children[0]).type.toBe(Cube.typeName);
  expect((repetition as any).group.length).toEqual(10);
});