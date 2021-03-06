import { IFolder, FolderModel } from "./models/folder";

/**
 * Función para conseguir todas las carpetas padres de la carpeta pasada como parámetro
 * @param folder carpeta de la que se quieren obtener los padres
 * @param path listado de padres
 */
export const getParentsPath = async (
  folder: IFolder,
  path: IFolder[] = []
): Promise<IFolder[]> => {
  if (folder.name === "root") {
    return [folder, ...path];
  } else {
    const parentFolder = await FolderModel.findOne({
      _id: folder.parentFolder
    });
    const result = await getParentsPath(parentFolder!, [folder]);
    return [...result, ...path];
  }
};

export enum OrderType {
  Creation = "creation",
  Modification = "modification",
  NameAZ = "nameAZ",
  NameZA = "nameZA"
}

export const sortByCreatedAt = (a, b) => {
  const aCreatedAt = a && a.createdAt;
  const bCreatedAt = b && b.createdAt;
  return Math.sign(bCreatedAt - aCreatedAt);
};

export const sortByUpdatedAt = (a, b) => {
  const aUpdatedAt = a && a.updatedAt;
  const bUpdatedAt = b && b.updatedAt;
  return Math.sign(bUpdatedAt - aUpdatedAt);
};

export const sortByTitleAZ = (a, b) => {
  try {
    let aTitle: string = "";
    let bTitle: string = "";
    if (a && a.name && b && b.name) {
      aTitle = a.name.toLowerCase();
      bTitle = b.name.toLowerCase();
    }
    if (a && a.title && b && b.title) {
      aTitle = a.title.toLowerCase();
      bTitle = b.title.toLowerCase();
    }
    return aTitle === bTitle ? 0 : aTitle < bTitle ? -1 : 1;
  } catch (e) {
    return undefined;
  }
};

export const sortByTitleZA = (a, b) => {
  try {
    let aTitle: string = "";
    let bTitle: string = "";
    if (a && a.name && b && b.name) {
      aTitle = a.name.toLowerCase();
      bTitle = b.name.toLowerCase();
      return aTitle === bTitle ? 0 : aTitle > bTitle ? -1 : 1;
    }
    if (a && a.title && b && b.title) {
      aTitle = a.title.toLowerCase();
      bTitle = b.title.toLowerCase();
    }
    return aTitle === bTitle ? 0 : aTitle > bTitle ? -1 : 1;
  } catch (e) {
    return undefined;
  }
};

export const orderFunctions = {
  [OrderType.Creation]: sortByCreatedAt,
  [OrderType.Modification]: sortByUpdatedAt,
  [OrderType.NameAZ]: sortByTitleAZ,
  [OrderType.NameZA]: sortByTitleZA
};
