import React, { FC, useLayoutEffect, useRef, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { IFolder } from "@bitbloq/api";
import { Icon } from "@bitbloq/ui";
import { FOLDER_QUERY } from "../apollo/queries";
import styled from "@emotion/styled";

interface ISelectorOptionProps {
  folder: IFolder;
  selectedFolder?: IFolder;
  setSelectedFolder: (folder: IFolder) => void;
}

const SelectorOption: FC<ISelectorOptionProps> = ({
  folder,
  selectedFolder,
  setSelectedFolder
}) => {
  const selectorRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const onClick = (e: MouseEvent) => {
      e.stopPropagation();
      setSelectedFolder(folder);
    };
    selectorRef.current!.addEventListener("click", onClick);

    return () => selectorRef.current!.removeEventListener("click", onClick);
  });

  return (
    <FolderSelectorOption
      ref={selectorRef}
      selectedFolder={!!selectedFolder && selectedFolder.id === folder.id}
    >
      <MenuIcon name="folder-icon" />
      <p>{folder.name}</p>
    </FolderSelectorOption>
  );
};

export interface IFolderSelectorMenuProps {
  className?: string;
  currentLocation?: IFolder;
  selectedToMove: { id: string | null; parent?: string | null };
  onMove: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    selectedFolder: IFolder
  ) => any;
}

const FolderSelectorMenu: FC<IFolderSelectorMenuProps> = ({
  className,
  currentLocation,
  selectedToMove,
  onMove
}) => {
  const [selectedFolder, setSelectedFolder] = useState(currentLocation);
  const { data, loading } = useQuery(FOLDER_QUERY, {
    variables: {
      id: selectedFolder!.id
    }
  });

  const parentButtonRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const onClick = (e: MouseEvent) => {
      e.stopPropagation();
      setSelectedFolder({ id: parentFolder, name: "" });
    };
    if (parentButtonRef.current) {
      parentButtonRef.current.addEventListener("click", onClick);
    }

    return () => {
      if (parentButtonRef.current) {
        parentButtonRef.current.removeEventListener("click", onClick);
      }
    };
  });

  if (loading) {
    return <FolderSelector>loading...</FolderSelector>;
  }
  const {
    folders: foldersData,
    name: folderName,
    parentFolder,
    id
  } = data.folder;
  return (
    <FolderSelector className={className}>
      <ParentButton ref={parentButtonRef}>
        {folderName ? (
          folderName === "root" ? (
            <p>Mis documentos</p>
          ) : (
            <>
              <ArrowIcon>
                <Icon name="arrow" />
              </ArrowIcon>
              <MenuIcon title={true} name="folder-icon" />
              <p>{folderName}</p>
            </>
          )
        ) : null}
      </ParentButton>
      <FolderSelectorOptions showMove={selectedToMove.parent !== id}>
        {foldersData &&
          foldersData
            .filter(
              (op: { id: string; parentFolder: string }) =>
                op.id !== selectedToMove.id
            )
            .map((folder, i) => (
              <SelectorOption
                key={folder.id}
                folder={folder}
                selectedFolder={selectedFolder}
                setSelectedFolder={setSelectedFolder}
              />
            ))}
      </FolderSelectorOptions>
      {selectedToMove.parent !== id && (
        <MoveButton onClick={e => onMove(e, selectedFolder!)}>
          <p>Mover aquí</p>
        </MoveButton>
      )}
    </FolderSelector>
  );
};

export default FolderSelectorMenu;

/* styled components */

const FolderSelector = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 200;
  top: 0px;
  width: 278px;
  height: 316px;
  border-radius: 4px;
  box-shadow: 0 3px 7px 0 rgba(0, 0, 0, 0.5);
  border: solid 1px #cfcfcf;
  background-color: white;
  &:hover {
    cursor: pointer;
  }
`;

const FolderSelectorOptions = styled.div<{ showMove?: boolean }>`
  overflow: scroll;
  height: ${props => (props.showMove ? 235 : 270)}px;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const FolderSelectorOption = styled.div<{ selectedFolder: boolean }>`
  width: 100%;
  height: 35px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ebebeb;
  cursor: pointer;
  background-color: ${props => (props.selectedFolder ? "#ebebeb" : "white")};

  p {
    max-width: 226px;
    color: black;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:hover {
    background-color: #ebebeb;
  }
`;

const ParentButton = styled.div`
  height: 40px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #ebebeb;
  border-bottom: 1px solid #ebebeb;

  p {
    flex: 1;
    margin-left: 10px;
    font-family: Roboto;
    font-size: 14px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    letter-spacing: normal;
    color: #373b44;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const ArrowIcon = styled.div`
  height: 40px;
  width: 40px;
  border-right: 1px solid #ebebeb;
  display: flex;

  align-items: center;
  justify-content: center;
`;

const MoveButton = styled.div`
  height: 40px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #ebebeb;
  position: absolute;
  bottom: 0;

  p {
    font-family: Roboto;
    font-size: 14px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    letter-spacing: normal;
    color: #373b44;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const MenuIcon = styled(Icon)<{ title?: boolean }>`
  margin-right: ${props => (props.title ? 0 : 14)}px;
  margin-left: 13px;
  height: ${props => (props.title ? 20 : 13)}px;
  width: ${props => (props.title ? 20 : 13)}px;
`;
