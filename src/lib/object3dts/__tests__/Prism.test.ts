/**
 * Copyright (c) 2018 Bitbloq (BQ)
 *
 * License: MIT
 *
 * long description for the file
 *
 * @summary short description for the file
 * @author David García <https://github.com/empoalp>, Alberto Valero <https://github.com/avalero>
 *
 * Created at     : 2018-11-15 20:29:01 
 * Last modified  : 2018-11-15 20:40:52
 */


import Prism, { IPrismJSON } from '../Prism';
import * as THREE from 'three';
import ObjectsCommon, { ITranslateOperation, IRotateOperation, IScaleOperation } from '../ObjectsCommon';

const sides = 6;
const length = 5;
const height = 10;

test('Check params are well passed', () =>{
  const object = new Prism({sides, length, height});
  expect((object as any).parameters.sides).toBe(sides);
  expect((object as any).parameters.length).toBe(length);
  expect((object as any).parameters.height).toBe(height);
});

test('Check there are no initial operations', () =>{
  const object = new Prism({sides, length, height});
  expect((object as any).operations).toEqual([]);
});

test('Check mesh needs to be computed', () => {
  const object = new Prism({sides, length, height});
  expect(object.meshUpdateRequired).toBe(true); 
});


test('Check params are well passed and mesh needs to be recomputed', () =>{
  // Update parameters to same value to check if updateRequired switches to true
  const object = new Prism({sides, length, height});
  object.setParameters({sides:5, length:5, height:5});
  expect((object as any).parameters).toEqual({sides:5, length:5, height:5});
  expect(object.meshUpdateRequired).toBe(true);
  object.getPrimitiveMeshAsync().then(mesh1 => {
    expect(object.meshUpdateRequired).toBe(false);
    object.getPrimitiveMeshAsync().then(mesh2 => {
      expect(mesh1).toBe(mesh2);
    });
  });
});


test('Check mesh needs to be computed only once', () => {
  const object = new Prism({sides, length, height});
  expect(object.meshUpdateRequired).toBe(true);
  object.setParameters({sides, length, height});
  expect((object as any).parameters).toEqual({sides, length, height});
  expect(object.meshUpdateRequired).toBe(true);
});


test('Check initial position and rotation', () => {
  const object = new Prism({sides, length, height});
  return object.getPrimitiveMeshAsync().then( mesh => {
    const center = mesh.position;
    const euler = mesh.rotation;
    expect(center).toEqual(new THREE.Vector3(0,0,0));
    expect(euler.x).toBeCloseTo(0);
    expect(euler.y).toBeCloseTo(0);
    expect(euler.z).toBeCloseTo(0);
  })
  
});


// ASYNC TESTS

test('Async Check params are well passed and mesh needs to be recomputed', () =>{
  // Update parameters to same value to check if updateRequired switches to true
  const object = new Prism({sides, length, height});
  object.setParameters({sides:5, length:5, height:5});
  expect((object as any).parameters).toEqual({sides:5, length:5, height:5});
  expect(object.meshUpdateRequired).toBe(true);

  return object.getMeshAsync().then( mesh1 => {
    expect(object.meshUpdateRequired).toBe(false);
    return object.getMeshAsync().then ( mesh2 => {
      expect(mesh1).toBe(mesh2);
    });
  });
});

test('Async Check initial position and rotation', () => {
  const object = new Prism({sides, length, height});
  return object.getMeshAsync().then( mesh =>{
    const center = mesh.position;
    const euler = mesh.rotation;
    expect(center).toEqual(new THREE.Vector3(0,0,0));
    expect(euler.x).toBeCloseTo(0);
    expect(euler.y).toBeCloseTo(0);
    expect(euler.z).toBeCloseTo(0);
  });
});


// CHECK FROM JSON - TO JSON - CLONE

test('Prism - toJSON - Parameteres', () => {
  const object = new Prism({sides, length, height});
  const json = object.toJSON();
  const obj:IPrismJSON = JSON.parse(json);
  expect(obj.parameters.sides).toEqual(sides);
  expect(obj.parameters.height).toEqual(height);
  expect(obj.parameters.length).toEqual(length);
});

test('Prism - toJSON - Operations', () => {
  const x = 5; const y = 10; const z = 20;
  const axis = 'z'; const angle = 30;
  
  const object = new Prism(
    {sides, height, length}, 
    [
      ObjectsCommon.createTranslateOperation(x,y,z),
      ObjectsCommon.createRotateOperation(axis, angle)
    ]
    );
  const json = object.toJSON();
  const obj:IPrismJSON = JSON.parse(json);
  expect(obj.operations.length).toEqual(2);
  expect(obj.operations[0].type).toEqual('translation');
  expect(obj.operations[1].type).toEqual('rotation');
  expect((obj.operations[0] as ITranslateOperation).x).toEqual(x);
  expect((obj.operations[0] as ITranslateOperation).y).toEqual(y);
  expect((obj.operations[0] as ITranslateOperation).z).toEqual(z);
  expect((obj.operations[1] as IRotateOperation).axis).toEqual(axis);
  expect((obj.operations[1] as IRotateOperation).angle).toEqual(angle);
  object.addOperations([ObjectsCommon.createScaleOperation(x,y,z)]);
  const json2 = object.toJSON();
  const obj2:IPrismJSON = JSON.parse(json2);
  expect(obj2.operations.length).toEqual(3);
  expect(obj2.operations[0].type).toEqual('translation');
  expect(obj2.operations[1].type).toEqual('rotation');
  expect(obj2.operations[2].type).toEqual('scale');
  expect((obj2.operations[0] as ITranslateOperation).x).toEqual(x);
  expect((obj2.operations[0] as ITranslateOperation).y).toEqual(y);
  expect((obj2.operations[0] as ITranslateOperation).z).toEqual(z);
  expect((obj2.operations[1] as IRotateOperation).axis).toEqual(axis);
  expect((obj2.operations[1] as IRotateOperation).angle).toEqual(angle);
  expect((obj2.operations[2] as IScaleOperation).x).toEqual(x);
  expect((obj2.operations[2] as IScaleOperation).y).toEqual(y);
  expect((obj2.operations[2] as IScaleOperation).z).toEqual(z);
  
});

test('Prism - toJSON - ViewOptions', () => {
  const color = '#abcdef'
  const visible = true;
  const name = 'Object123';
  const highlighted = false;

  const object = new Prism({sides, height, length},[],ObjectsCommon.createViewOptions(color,visible,highlighted,name));
  const json = object.toJSON();
  const obj:IPrismJSON = JSON.parse(json);
  expect(obj.viewOptions.color).toEqual(color);
  expect(obj.viewOptions.name).toEqual(name);
  expect(obj.viewOptions.visible).toEqual(visible);
  expect(obj.viewOptions.highlighted).toEqual(highlighted);
});

test('Prism - fromJSON - Parameteres', () => {
  const object1 = new Prism({sides, height, length});
  const json1 = object1.toJSON();
  const object = Prism.newFromJSON(json1);
  const json = object.toJSON();
  const obj = JSON.parse(json);
  expect(obj.parameters.length).toEqual(length);
  expect(obj.parameters.height).toEqual(height);
  expect(obj.parameters.sides).toEqual(sides);
});


test('Cube - fromJSON - Operations', () => {
  const x = 5; const y = 10; const z = 20;
  const axis = 'z'; const angle = 30;
  
  const object1 = new Prism(
    {length, height, sides}, 
    [
      ObjectsCommon.createTranslateOperation(x,y,z),
      ObjectsCommon.createRotateOperation(axis, angle)
    ]
    );
  const json1 = object1.toJSON();
  const object = Prism.newFromJSON(json1);
  const json = object.toJSON();
  const obj:IPrismJSON = JSON.parse(json);
  expect(obj.operations.length).toEqual(2);
  expect(obj.operations[0].type).toEqual('translation');
  expect(obj.operations[1].type).toEqual('rotation');
  expect((obj.operations[0] as ITranslateOperation).x).toEqual(x);
  expect((obj.operations[0] as ITranslateOperation).y).toEqual(y);
  expect((obj.operations[0] as ITranslateOperation).z).toEqual(z);
  expect((obj.operations[1] as IRotateOperation).axis).toEqual(axis);
  expect((obj.operations[1] as IRotateOperation).angle).toEqual(angle);
});

test('Cube - fromJSON - ViewOptions', () => {
  const color = '#abcdef'
  const visible = true;
  const name = 'Object123';
  const highlighted = false;
  

  const object1 = new Prism({length, height, sides},[],ObjectsCommon.createViewOptions(color,visible,highlighted,name));
  const json1 = object1.toJSON();
  const object = Prism.newFromJSON(json1);
  const json = object.toJSON();
  const obj:IPrismJSON = JSON.parse(json);
  expect(obj.viewOptions.color).toEqual(color);
  expect(obj.viewOptions.name).toEqual(name);
  expect(obj.viewOptions.visible).toEqual(visible);
  expect(obj.viewOptions.highlighted).toEqual(highlighted);
});


test('Prism - UpdateFromJSON - ', () => {
  
  const color = '#abcdef'
  const visible = true;
  const name = 'Object123';
  const highlighted = false;
  const x = 5; const y = 10; const z = 20;
  const axis = 'z'; const angle = 30;

  const object = new Prism(
    { sides:3*sides, height:2*height, length:5*length },
    [
      ObjectsCommon.createTranslateOperation(2*x,3*y,5*z),
      ObjectsCommon.createRotateOperation('y', 2*angle)
    ],
    ObjectsCommon.createViewOptions(color,visible,highlighted,name)
    );

  const object1 = new Prism(
    { sides, height, length },
    [
      ObjectsCommon.createTranslateOperation(x,y,z),
      ObjectsCommon.createRotateOperation(axis, angle)
    ],
    ObjectsCommon.createViewOptions(color,visible,highlighted,name)
    );

  let json1 = object1.toJSON();
  
  const obj1:IPrismJSON = JSON.parse(json1);
  
  obj1.id = object.getID();
  json1 = JSON.stringify(obj1);
  
  object.updateFromJSON(json1);
  
  const json = object.toJSON();
  const obj:IPrismJSON = JSON.parse(json);

  expect(obj.parameters.sides).toEqual(sides);
  expect(obj.parameters.height).toEqual(height);
  expect(obj.parameters.length).toEqual(length);

  expect(obj.viewOptions.color).toEqual(color);
  expect(obj.viewOptions.name).toEqual(name);
  expect(obj.viewOptions.visible).toEqual(visible);
  expect(obj.viewOptions.highlighted).toEqual(highlighted);

  expect(obj.operations.length).toEqual(2);
  expect(obj.operations[0].type).toEqual('translation');
  expect(obj.operations[1].type).toEqual('rotation');
  expect((obj.operations[0] as ITranslateOperation).x).toEqual(x);
  expect((obj.operations[0] as ITranslateOperation).y).toEqual(y);
  expect((obj.operations[0] as ITranslateOperation).z).toEqual(z);
  expect((obj.operations[1] as IRotateOperation).axis).toEqual(axis);
  expect((obj.operations[1] as IRotateOperation).angle).toEqual(angle);
});


// CLONE

test('Cube - clone() - Parameteres', () => {
  const aux = new Prism({sides, height, length});
  const object = aux.clone();
  const json = object.toJSON();
  const obj:IPrismJSON = JSON.parse(json);
  expect(obj.parameters.sides).toEqual(sides);
  expect(obj.parameters.height).toEqual(height);
  expect(obj.parameters.length).toEqual(length);
});


test('Cube - CLONE - Operations', () => {
  const x = 5; const y = 10; const z = 20;
  const axis = 'z'; const angle = 30;
  
  const aux = new Prism(
    {sides, height, length}, 
    [
      ObjectsCommon.createTranslateOperation(x,y,z),
      ObjectsCommon.createRotateOperation(axis, angle)
    ]
    );

  const object = aux.clone();
  const json = object.toJSON();
  const obj:IPrismJSON = JSON.parse(json);
  expect(obj.operations.length).toEqual(2);
  expect(obj.operations[0].type).toEqual('translation');
  expect(obj.operations[1].type).toEqual('rotation');
  expect((obj.operations[0] as ITranslateOperation).x).toEqual(x);
  expect((obj.operations[0] as ITranslateOperation).y).toEqual(y);
  expect((obj.operations[0] as ITranslateOperation).z).toEqual(z);
  expect((obj.operations[1] as IRotateOperation).axis).toEqual(axis);
  expect((obj.operations[1] as IRotateOperation).angle).toEqual(angle);
});

test('Cube - Clone - ViewOptions', () => {
  const color = '#abcdef'
  const visible = true;
  const name = 'Object123';
  const highlighted = false;

  const object1 = new Prism({sides, height, length},[],ObjectsCommon.createViewOptions(color,visible,highlighted,name));
  const object = object1.clone();
  const json = object.toJSON();
  const obj:IPrismJSON = JSON.parse(json);
  expect(obj.viewOptions.color).toEqual(color);
  expect(obj.viewOptions.name).toEqual(name);
  expect(obj.viewOptions.visible).toEqual(visible);
  expect(obj.viewOptions.highlighted).toEqual(highlighted);
});