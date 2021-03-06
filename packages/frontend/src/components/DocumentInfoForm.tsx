import React, { FC, useEffect, useState } from "react";
import { IResource, LIMIT_SIZE } from "@bitbloq/api";
import {
  colors,
  FileSelectButton,
  Input,
  TextArea,
  DialogModal,
  useTranslate
} from "@bitbloq/ui";
import styled from "@emotion/styled";
import ResourcesBox from "./ResourcesBox";
import { resourceTypes, maxLengthName } from "../config";
import { isValidName } from "../util";
import { ResourcesTypes } from "../types";

export interface IDocumentInfoFormProps {
  name?: string;
  description?: string;
  documentId: string;
  image: string;
  isTeacher?: boolean;
  resourceAdded: (id: string) => void;
  resourceDeleted: (id: string) => void;
  resources?: IResource[];
  resourcesTypesAccepted: ResourcesTypes[];
  onChange: (newValues: {
    name?: string;
    description?: string;
    image?: File;
  }) => void;
}

const DocumentInfoForm: FC<IDocumentInfoFormProps> = ({
  name,
  description,
  documentId,
  image,
  isTeacher,
  resourceAdded,
  resourceDeleted,
  resources = [],
  resourcesTypesAccepted,
  onChange
}) => {
  const [imageError, setImageError] = useState("");
  const [nameInput, setName] = useState(name);
  const [nameError, setNameError] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const t = useTranslate();

  useEffect(() => {
    if (!nameFocused) {
      setName(name);
    }
  }, [name, nameFocused]);

  const onFileSelected = (file: File) => {
    if (
      resourceTypes[ResourcesTypes.image].formats.indexOf(
        `.${file.type.replace("image/", "")}`
      ) < 0
    ) {
      setImageError(t("document-info.errors.image-ext"));
    } else if (file.size > LIMIT_SIZE.MAX_DOCUMENT_IMAGE_BYTES) {
      setImageError(t("document-info.errors.image-size"));
    } else {
      onChange({
        name,
        description,
        image: file
      });
    }
  };

  return (
    <Container>
      <Panel>
        <Header>{t("document-info.title")}</Header>
        <Form>
          <FormRow>
            <FormLabel>
              <label>{t("document-info.labels.title")}</label>
            </FormLabel>
            <FormInput>
              <Input
                value={nameInput}
                placeholder={t("document-info.placeholders.title")}
                onChange={e => {
                  const value: string = e.target.value;
                  if (isValidName(value)) {
                    setNameError(false);
                    onChange({
                      name: value,
                      description
                    });
                  } else {
                    setNameError(true);
                  }
                  setName(value);
                }}
                error={nameError}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
                maxLength={maxLengthName}
              />
            </FormInput>
          </FormRow>
          <FormRow>
            <FormLabel>
              <label>{t("document-info.labels.description")}</label>
            </FormLabel>
            <FormInput>
              <TextArea
                value={
                  description === t("document-body-description")
                    ? undefined
                    : description
                }
                placeholder={t("document-info.placeholders.description")}
                onChange={e => {
                  onChange({
                    name,
                    description: e.target.value
                  });
                }}
                rows={3}
              />
            </FormInput>
          </FormRow>
          <FormRow>
            <FormLabel>
              <label>{t("document-info.labels.image")}</label>
              <FormSubLabel>
                {t("document-info.sublabels.image", [
                  (
                    LIMIT_SIZE.MAX_DOCUMENT_IMAGE_BYTES /
                    (1024 * 1024)
                  ).toString()
                ])}
              </FormSubLabel>
            </FormLabel>
            <FormInput>
              <Image src={image} />
              <ImageButton
                accept="image/*"
                tertiary
                onFileSelected={onFileSelected}
              >
                {t("document-info.buttons.image")}
              </ImageButton>
            </FormInput>
          </FormRow>
        </Form>
        {isTeacher && (
          <Form>
            <FormRow>
              <FormLabel>
                <label>{t("document-info.labels.resources")}</label>
                <FormSubLabel>
                  {t("document-info.sublabels.resources")}
                </FormSubLabel>
              </FormLabel>
              <FormInput>
                <ResourcesBox
                  documentId={documentId}
                  resourceAdded={resourceAdded}
                  resourceDeleted={resourceDeleted}
                  resources={resources}
                  resourcesTypesAccepted={resourcesTypesAccepted}
                />
              </FormInput>
            </FormRow>
          </Form>
        )}
      </Panel>
      <DialogModal
        title="Aviso"
        isOpen={!!imageError}
        text={imageError}
        okText="Aceptar"
        onOk={() => setImageError("")}
      />
    </Container>
  );
};

export default DocumentInfoForm;

/* styled components */

const Container = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
  justify-content: center;
  padding: 40px;
  background-color: ${colors.gray1};
`;

const Panel = styled.div`
  align-self: flex-start;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 3px 0 #c7c7c7;
  background-color: white;
  width: 100%;
  max-height: 100%;
  max-width: 900px;
  overflow: scroll;
`;

const Header = styled.div`
  background-color: #fff;
  border-bottom: 1px solid ${colors.gray2};
  font-size: 16px;
  font-weight: bold;
  padding: 0px 30px;
  position: sticky;
  height: 50px;
  top: 0;
  display: flex;
  align-items: center;
`;

const Form = styled.div`
  border-bottom: 1px solid ${colors.gray2};
  padding: 20px 30px;

  &:last-of-type {
    border-bottom: none;
  }
`;

const FormRow = styled.div`
  display: flex;
  margin-bottom: 20px;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const FormLabel = styled.div`
  flex: 1;
  font-size: 14px;
  margin-right: 30px;

  label {
    min-height: 35px;
    display: flex;
    align-items: center;
    line-height: 1.4;
  }
`;

const FormSubLabel = styled.div`
  font-size: 12px;
  font-style: italic;
  margin-top: 10px;
`;

const FormInput = styled.div`
  flex: 2;
  max-width: 66%;
`;

const Image = styled.div<{ src: string }>`
  border: 1px solid ${colors.gray3};
  border-radius: 4px;
  width: 250px;
  height: 160px;
  margin-bottom: 10px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
`;

const ImageButton = styled(FileSelectButton)`
  width: 250px;
`;
