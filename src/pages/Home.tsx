import { View } from "@adobe/react-spectrum";
import React from "react";
import { useStores } from "../hooks/useStores";

import styled from "../styles/styled";
import { RootNode } from "../xd/scenegraph/rootNode";
import { Artboard } from "../xd/scenegraph/artboard";
import { useHistory } from "react-router-dom";

const Root = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  background-color: rgb(228, 228, 228);
`;

const Template = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 360px;
  margin: auto;
  padding: 0 16px;
  background-color: ${({ theme }) => theme.palette.background.default};
`;

const TemplateItem = styled.div`
  width: 200px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  border-radius: 12px;

  &:hover {
    background-color: ${({ theme }) => theme.palette.background.hover};
  }
`;

const Home = () => {
  const { projectStore } = useStores();
  const history = useHistory();
  const handleCreateProject = (width: number, height: number) => {
    const rootNode = new RootNode();
    const initialArtboard = new Artboard();
    rootNode.addChild(initialArtboard);
    projectStore.rootNode = rootNode;
    history.replace("/design");
  };

  return (
    <Root>
      <Template>
        <TemplateItem
          onClick={() => {
            handleCreateProject(375, 812);
          }}
        >
          <View>
            <div>iPhone X/XS/11 Pro</div>
            <div>375 x 812 px</div>
          </View>
        </TemplateItem>
        <TemplateItem
          onClick={() => {
            handleCreateProject(1920, 1080);
          }}
        >
          <View>
            <div>Web 1920</div>
            <div>1920 x 1080 px</div>
          </View>
        </TemplateItem>
      </Template>
    </Root>
  );
};

export default Home;
