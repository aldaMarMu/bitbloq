import React from 'react';
import styled from '@emotion/styled';
import {css} from '@emotion/core';
import {colors, withTranslate} from '@bitbloq/ui';
import config from '../../config/threed';

export interface Shape {
  type: string;
  parameters: object;
}

export interface ShapeGroup {
  label: string;
  icon: string;
  shapes: Shape[];
}

export interface AddObjectDropDownProps {
  shapeGroups: ShapeGroup[];
  onAddObject: (shapeConfig: Shape) => any;
  t: (id: string) => string;
}

class State {
  readonly activeTab: number = 0;
}

class AddObjectDropdown extends React.Component<AddObjectDropDownProps, State> {
  readonly state = new State();
  private groupsRef = React.createRef();

  onScroll = e => {
    const {activeTab} = this.state;
    const groups = this.groupsRef.current;
    const scrollTop = groups.scrollTop;
    let visibleTab;
    Array.from(groups.children).forEach((child, i) => {
      if (child.offsetTop - scrollTop < 200) {
        visibleTab = i
      }
    });
    if (visibleTab !== activeTab) {
      this.setState({ activeTab: visibleTab });
    }
  };

  onSelectGroup = i => {
    const groups = this.groupsRef.current;
    const scrollTop = groups.children[i].offsetTop;
    groups.scrollTop = scrollTop;
    this.setState({ activeTab: i });
  };

  render() {
    const {activeTab} = this.state;
    const {shapeGroups, onAddObject, t} = this.props;

    return (
      <Container>
        <Tabs>
          {shapeGroups.map((group, i) => (
            <Tab
              key={i}
              active={i === activeTab}
              onClick={() => this.onSelectGroup(i)}>
              {group.icon}
            </Tab>
          ))}
        </Tabs>
        <ShapeGroups ref={this.groupsRef} onScroll={this.onScroll}>
          {shapeGroups.map(group => (
            <ShapeGroup key={group.label}>
              <GroupLabel>{t(group.label)}</GroupLabel>
              <Shapes>
                {group.shapes.map(shape => (
                  <Shape key={shape.label} onClick={() => onAddObject(shape)}>
                    <ShapeImage>{shape.icon}</ShapeImage>
                    <ShapeText>{t(shape.label)}</ShapeText>
                  </Shape>
                ))}
              </Shapes>
            </ShapeGroup>
          ))}
        </ShapeGroups>
      </Container>
    );
  }
}

export default withTranslate(AddObjectDropdown);

/* styled components */

const Container = styled.div`
  display: flex;
  background-color: white;
  width: 380px;
  height: 400px;
  box-shadow: 0 3px 7px 0 rgba(0, 0, 0, 0.5);
`;

const Tabs = styled.div`
  width: 60px;
  border-right: 1px solid ${colors.gray3};
`;

interface TabProps {
  active: boolean;
}
const Tab = styled.div<TabProps>`
  height: 60px;
  width: 60px;
  border-bottom: 1px solid white;
  background-color: #b9bdc8;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  svg {
    width: 24px;
    height: 24px;
  }

  ${props =>
    props.active &&
    css`
      background-color: white;
      color: ${colors.gray3};
      border-right: 1px solid white;
      border-bottom: 1px solid ${colors.gray3};
    `}
`;

const ShapeGroups = styled.div`
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ShapeGroup = styled.div`
  padding: 20px;
  box-sizing: border-box;
  &:last-of-type {
    min-height: 400px;
  }
`;

const GroupLabel = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 20px;
`;

const Shapes = styled.div`
  display: grid;
  grid-template-columns: auto auto auto;
  grid-column-gap: 20px;
  grid-row-gap: 20px;
`;

const Shape = styled.div`
  cursor: pointer;
`;

const ShapeImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 4px;
  background-color: #def6fb;
  display: flex;
  justify-content: center;
  align-items: center;

  svg, img {
    width: 56px;
    height: 56px;
  }
`;

const ShapeText = styled.div`
  margin-top: 4px;
  font-size: 14px;
`;