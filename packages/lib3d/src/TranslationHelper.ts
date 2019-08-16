/**
 * Copyright (c) 2018 Bitbloq (BQ)
 *
 * License: MIT
 *
 * long description for the file
 *
 * @summary short description for the file
 * @author David García <https://github.com/empoalp>,
 * @author Alberto Valero <https://github.com/avalero>
 *
 * Created at     : 2018-10-17 12:30:31
 * Last modified  : 2018-12-16 19:55:28
 */

import * as THREE from 'three';
import ObjectsCommon from './ObjectsCommon';
import PositionCalculator from './PositionCalculator';

export default class TranslationHelper {
  private helperMesh: THREE.Group;
  private obj: ObjectsCommon;
  private axis: string;
  private relative: boolean;

  constructor(obj: ObjectsCommon, axis: string, relative: boolean) {
    this.obj = obj;
    this.axis = axis;
    this.relative = relative;
  }

  public async getHelperMeshAsync(): Promise<THREE.Group> {
    const mesh = await this.obj.getMeshAsync();

    if (
      mesh instanceof THREE.Mesh ||
      (mesh.userData &&
        mesh.userData.type &&
        mesh.userData.type === 'RepetitionObject')
    ) {
      const boundingBoxDims: THREE.Vector3 = new THREE.Vector3();
      new THREE.Box3().setFromObject(mesh).getSize(boundingBoxDims);
      const radius: number = 0.3;
      let color: number;
      const separation: number = 3;
      const length: number = 20;
      const arrowLength: number = 5;
      let offset: number;
      let offsetArrow: number;

      if (this.axis === 'x') {
        color = 0xff0000;
        offset = boundingBoxDims.x / 2 + separation + length / 2;
        offsetArrow =
          boundingBoxDims.x / 2 + separation + arrowLength / 2 + length;
      } else if (this.axis === 'y') {
        color = 0x00ff00;
        offset = boundingBoxDims.y / 2 + separation + length / 2;
        offsetArrow =
          boundingBoxDims.y / 2 + separation + arrowLength / 2 + length;
      } else {
        color = 0x0000ff;
        offset = boundingBoxDims.z / 2 + separation + length / 2;
        offsetArrow =
          boundingBoxDims.z / 2 + separation + arrowLength / 2 + length;
      }

      const cylinderGeometry: THREE.Geometry = new THREE.CylinderGeometry(
        radius,
        radius,
        length
      );
      cylinderGeometry.rotateZ(Math.PI / 2);
      cylinderGeometry.translate(offset, 0, 0);

      const arrowGeometry: THREE.Geometry = new THREE.CylinderGeometry(
        2 * radius,
        0,
        5,
        20
      );
      arrowGeometry.rotateZ(Math.PI / 2);
      arrowGeometry.translate(offsetArrow, 0, 0);

      const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
        color,
        opacity: 0.5,
        transparent: true,
        depthWrite: false,
      });

      this.helperMesh = new THREE.Group();
      this.helperMesh.add(new THREE.Mesh(cylinderGeometry, material));
      this.helperMesh.add(new THREE.Mesh(arrowGeometry, material));

      const position = (await new PositionCalculator(
        this.obj
      ).getPositionAsync()).position;
      this.helperMesh.position.set(position.x, position.y, position.z);

      if (this.relative) {
        this.helperMesh.setRotationFromEuler(mesh.rotation);
      }

      if (this.axis === 'y') {
        this.helperMesh.rotateZ(Math.PI / 2);
      }
      if (this.axis === 'z') {
        this.helperMesh.rotateY(-Math.PI / 2);
        this.helperMesh.rotateX(Math.PI / 2);
      }
    }

    // TODO

    //  else if (mesh instanceof THREE.Group) {
    //   const groups: THREE.Group[] = mesh.children.map(m => {
    //     const transHelper: TranslationHelper = new TranslationHelper(
    //       this.obj,
    //       this.axis,
    //       this.relative
    //     );
    //     return transHelper.getHelperMeshAsync();
    //   });

    //   this.helperMesh = new THREE.Group();

    //   this.helperMesh.children = groups.flatMap(group =>
    //     group.children.map(child => {
    //       child.position.copy(group.position);
    //       child.setRotationFromEuler(group.rotation);
    //       return child;
    //     })
    //   );
    // }
    return this.helperMesh;
  }
}
