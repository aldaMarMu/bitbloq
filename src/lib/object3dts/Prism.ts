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
 * Created at     : 2018-10-16 12:59:38 
 * Last modified  : 2018-11-15 20:22:47
 */

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
 * Created at     : 2018-10-02 19:16:51 
 * Last modified  : 2018-10-16 12:51:01
 */

import * as THREE from 'three';
import ObjectsCommon, {OperationsArray, IViewOptions} from './ObjectsCommon';
import Object3D from './Object3D';
import isEqual from 'lodash.isequal'

interface IPrismParams{
  sides:number,
  length:number,
  height:number
}

export interface IPrismJSON {
  id: string;
  type: string;
  parameters: IPrismParams;
  viewOptions: IViewOptions;
  operations: OperationsArray;
}

export default class Prism extends Object3D{

  public static typeName:string = 'Prism';

  public static newFromJSON(json:string):Prism{
    const object: IPrismJSON = JSON.parse(json);
    return new Prism(object.parameters, object.operations, object.viewOptions);
  }
  
  constructor(
    parameters: IPrismParams,
    operations: OperationsArray = [], 
    viewOptions: IViewOptions = ObjectsCommon.createViewOptions()
    ){
    super(viewOptions,operations);
    this.type = Prism.typeName;
    this.parameters = {...parameters};
    this._updateRequired = true;
  }

  protected getGeometry(): THREE.Geometry {
    let {sides,length,height} = this.parameters as IPrismParams;
    sides = Math.max(3, sides); length = Math.max(1,length), height = Math.max(1,height);
    this._updateRequired = false;
    const radius:number =  length/(2*Math.sin(Math.PI/sides));
    return new THREE.CylinderGeometry(Number(radius), Number(radius), Number(height), Number(sides)).rotateX(Math.PI/2);
  }

  protected getBufferGeometry(): THREE.BufferGeometry {
    let {sides,length,height} = this.parameters as IPrismParams;
    sides = Math.max(3, sides); length = Math.max(1,length), height = Math.max(1,height);
    this._updateRequired = false;
    const radius:number =  length/(2*Math.sin(Math.PI/sides));
    return new THREE.CylinderBufferGeometry(Number(radius), Number(radius), Number(height), Number(sides)).rotateX(Math.PI/2);
  }

  public clone():Prism{
    return Prism.newFromJSON(this.toJSON());  
  }

}
