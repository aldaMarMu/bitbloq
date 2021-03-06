import React, { FC } from "react";
import styled from "@emotion/styled";
import Icon from "../Icon";
import colors from "../../colors";

export interface INumberInputProps {
  value: number;
  onChange: (newValue: number) => any;
}

const NumberInput: FC<INumberInputProps> = ({ value, onChange }) => {
  return (
    <Container>
      <Spinner>
        <UpButton onClick={() => value < 90 && onChange(value + 10)}>
          <Icon name="angle" />
        </UpButton>
        <DownButton onClick={() => value > 9 && onChange(value - 10)}>
          <Icon name="angle" />
        </DownButton>
      </Spinner>
      <Spinner>
        <UpButton onClick={() => value < 99 && onChange(value + 1)}>
          <Icon name="angle" />
        </UpButton>
        <DownButton onClick={() => value > 0 && onChange(value - 1)}>
          <Icon name="angle" />
        </DownButton>
      </Spinner>
    </Container>
  );
};

export default NumberInput;

/* Styled components */

const Container = styled.div`
  background-color: ${colors.gray2};
  padding: 10px;
  display: flex;
`;

const Spinner = styled.div`
  margin-right: 6px;
  &:last-of-type {
    margin-right: 0px;
  }
`;

const Button = styled.button`
  border: none;
  width: 60px;
  height: 30px;
  cursor: pointer;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.black};

  box-shadow: 0 4px 0 0 #c0c3c9;
  transform: translate(0, -4px);

  &:focus {
    outline: none;
  }

  &:active {
    background-color: #c0c3c9;
    box-shadow: none;
    transform: translate(0, 0);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const UpButton = styled(Button)`
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  margin-bottom: 6px;

  svg {
    transform: rotate(180deg);
  }
`;

const DownButton = styled(Button)`
  border-bottom-left-radius: 40px;
  border-bottom-right-radius: 40px;
`;
