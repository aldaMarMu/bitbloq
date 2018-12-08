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
 * Created at     : 2018-11-09 09:31:03
 * Last modified  : 2018-11-28 12:46:25
 */

import Object3D from './Object3D';
import ObjectsCommon, {
  OperationsArray,
  IObjectsCommonJSON,
  IViewOptions,
} from './ObjectsCommon';

import isEqual from 'lodash.isequal';
import * as THREE from 'three';

import './custom.d';

import CompoundWorker from './compound.worker';

import {
  ITranslateOperation,
  IRotateOperation,
  IMirrorOperation,
  IScaleOperation,
} from './ObjectsCommon';
import ThreeDViewer from 'src/components/threed/ThreeDViewer';
import { promises } from 'fs';
import { resolve } from 'url';

export interface ICompoundObjectJSON extends IObjectsCommonJSON {
  children: Array<IObjectsCommonJSON>;
}

export type ChildrenArray = Array<Object3D>;

export default class CompoundObject extends Object3D {
  protected children: ChildrenArray;
  protected worker: CompoundWorker | null;

  constructor(
    children: ChildrenArray = [],
    operations: OperationsArray = [],
    viewOptions: IViewOptions = ObjectsCommon.createViewOptions(),
  ) {
    super(viewOptions, operations);
    if (children.length === 0)
      throw new Error('Compound Object requires at least one children');
    this.children = children;

    //children will have this CompoundObject as Parent
    this.children.forEach(child => child.setParent(this));
    
    this._meshUpdateRequired = true;
    this.setOperations();
  }

  public getChildren(): ChildrenArray {
    return this.children;
  }

  get meshUpdateRequired(): boolean {
    this.children.forEach(child => {
      this._meshUpdateRequired =
        this._meshUpdateRequired ||
        child.meshUpdateRequired ||
        child.pendingOperation;
    });

    return this._meshUpdateRequired;
  }

  set meshUpdateRequired(a: boolean) {
    this._meshUpdateRequired = a;
  }

  get pendingOperation(): boolean {
    this.children.forEach(child => {
      this._pendingOperation = this._pendingOperation || child.pendingOperation;
    });

    return this._pendingOperation;
  }

  set pendingOperation(a: boolean) {
    this._pendingOperation = a;
  }

  protected async applyOperationsAsync(): Promise<void> {
    //if there are children, mesh is centered at first child position/rotation

    const ch_mesh = await this.children[0].getMeshAsync();
    this.mesh.position.x = ch_mesh.position.x;
    this.mesh.position.y = ch_mesh.position.y;
    this.mesh.position.z = ch_mesh.position.z;
    this.mesh.quaternion.set(
      ch_mesh.quaternion.x,
      ch_mesh.quaternion.y,
      ch_mesh.quaternion.z,
      ch_mesh.quaternion.w,
    );

    this.mesh.scale.x = 1;
    this.mesh.scale.y = 1;
    this.mesh.scale.y = 1;

    this.operations.forEach(operation => {
      // Translate operation
      if (operation.type === Object3D.createTranslateOperation().type) {
        this.applyTranslateOperation(operation as ITranslateOperation);
      } else if (operation.type === Object3D.createRotateOperation().type) {
        this.applyRotateOperation(operation as IRotateOperation);
      } else if (operation.type === Object3D.createScaleOperation().type) {
        this.applyScaleOperation(operation as IScaleOperation);
      } else if (operation.type === Object3D.createMirrorOperation().type) {
        this.applyMirrorOperation(operation as IMirrorOperation);
      } else {
        throw Error('ERROR: Unknown Operation');
      }
    });
    this.mesh.updateMatrixWorld(true);
    this.mesh.updateMatrix();
    this._pendingOperation = false;

    return;
  }

  public async getMeshAsync(): Promise<THREE.Mesh> {
    // debugger;
    if(this.meshPromise){
      this.mesh = await this.meshPromise;
      this.meshPromise = null;
      return this.mesh;
    }else{
      return this.mesh;
    }
  }

  protected async computeMeshAsync(): Promise<THREE.Mesh> { 
    this.meshPromise = new Promise( async (resolve, reject) => {
      if (this.meshUpdateRequired) {
        if (this.worker) {
          this.worker.terminate();
          this.worker = null;
        }

        this.worker = new CompoundWorker();
        // listen to events from web worker

        (this.worker as CompoundWorker).onmessage = (event: any) => {
          if (event.data.status !== 'ok') {
            (this.worker as CompoundWorker).terminate();
            this.worker = null;
            reject(new Error('Compound Object Error'));
          }

          const message = event.data;
          //recompute object form vertices and normals
          this.fromBufferData(message.vertices, message.normals).then(
            mesh => {
              this.mesh = mesh;
              if (this.mesh instanceof THREE.Mesh) {
                this.applyOperationsAsync().then(() => {
                  this._meshUpdateRequired = false;
                  if (this.viewOptionsUpdateRequired) {
                    this.mesh.material = this.getMaterial();
                    this._viewOptionsUpdateRequired = false;
                  }
                  (this.worker as CompoundWorker).terminate();
                  this.worker = null;
                  resolve(this.mesh);
                });
              } else {
                (this.worker as CompoundWorker).terminate();
                this.worker = null;
                reject(new Error('Mesh not computed correctly'));
              }
            },
          );
        };
        // END OF EVENT HANDLER

        //Lets create an array of vertices and normals for each child
        this.toBufferArrayAsync().then(bufferArray => {
          const message = {
            type: this.getTypeName(),
            numChildren: this.children.length,
            bufferArray,
          };
          (this.worker as CompoundWorker).postMessage(message, bufferArray);
        });
      
      // mesh update not required  
      } else {
        if (this.pendingOperation) {
          await this.applyOperationsAsync();
        }
        this.mesh.material = this.getMaterial();
        resolve(this.mesh);
      }
    });

    return this.meshPromise;
  }


  protected fromBufferData(vertices: any, normals: any): Promise<THREE.Mesh> {
    return new Promise((resolve, reject) => {
      const buffGeometry = new THREE.BufferGeometry();
      buffGeometry.addAttribute(
        'position',
        new THREE.BufferAttribute(vertices, 3),
      );
      buffGeometry.addAttribute(
        'normal',
        new THREE.BufferAttribute(normals, 3),
      );
      const material = this.getMaterial();
      const mesh: THREE.Mesh = new THREE.Mesh(buffGeometry, material);
      resolve(mesh);
    });
  }

  protected toBufferArrayAsync(): Promise<Array<ArrayBuffer>> {
    return new Promise((resolve, reject) => {
      const bufferArray: Array<ArrayBuffer> = [];
      Promise.all(this.children.map(child => child.getMeshAsync())).then(
        meshes => {
          meshes.forEach(mesh => {
            const geom: THREE.BufferGeometry | THREE.Geometry = mesh.geometry;
            let bufferGeom: THREE.BufferGeometry;
            if (geom instanceof THREE.BufferGeometry) {
              bufferGeom = geom as THREE.BufferGeometry;
            } else {
              bufferGeom = new THREE.BufferGeometry().fromGeometry(
                geom as THREE.Geometry,
              );
            }
            const verticesBuffer: ArrayBuffer = new Float32Array(
              bufferGeom.getAttribute('position').array,
            ).buffer;
            const normalsBuffer: ArrayBuffer = new Float32Array(
              bufferGeom.getAttribute('normal').array,
            ).buffer;
            const positionBuffer: ArrayBuffer = Float32Array.from(
              mesh.matrixWorld.elements,
            ).buffer;
            bufferArray.push(verticesBuffer);
            bufferArray.push(normalsBuffer);
            bufferArray.push(positionBuffer);
          });
          resolve(bufferArray);
        },
      );
    });
  }

  public addChildren(child: Object3D): void {
    this.children.push(child);
    this._meshUpdateRequired = true;
  }

  public setChildren(children: ChildrenArray): void {
    if (!isEqual(children, this.children)) {
      this.children = children.slice();
      this._meshUpdateRequired = true;
    }
  }

  public toJSON(): ICompoundObjectJSON {
    return {
      ...super.toJSON(),
      children: this.children.map(obj => obj.toJSON()),
    };
  }

  /**
   * Returns Object Reference if found in children. If not, throws Error.
   * @param obj Object descriptor
   */
  private getChild(obj: IObjectsCommonJSON): ObjectsCommon {
    const result = this.children.find(object => object.getID() === obj.id);
    if (result) return result;
    else throw new Error(`Object id ${obj.id} not found in group`);
  }

  public updateFromJSON(object: ICompoundObjectJSON) {
    if (this.id !== object.id)
      throw new Error('Object id does not match with JSON id');
    
    
    const newchildren: Array<Object3D> = []
    //update children
    try {
      object.children.forEach(obj => {
        const objToUpdate = this.getChild(obj);
        newchildren.push(objToUpdate as Object3D);
        objToUpdate.updateFromJSON(obj);
      });

      if (!isEqual(this.children, newchildren)) {
        this.meshUpdateRequired = true;
        this.children = newchildren.slice(0);
      }
    } catch (e) {
      throw new Error(`Cannot update Compound Object: ${e}`);
    }

    //update operations and view options
    const vO = {
      ...ObjectsCommon.createViewOptions(),
      ...object.viewOptions,
    };
    this.setOperations(object.operations);
    this.setViewOptions(vO);

    // if anything has changed, recompute mesh
    if (!isEqual(this.lastJSON, this.toJSON())) {
      this.lastJSON = this.toJSON();
      this.meshPromise = this.computeMeshAsync();
      if(this.parent){
        this.parent.meshUpdateRequired = true;
        this.parent.computeMeshAsync();
      }
    }

  }
}
