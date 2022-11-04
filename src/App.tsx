// /** @jsx jsx */
import { useState, useCallback, useEffect } from "react";
import { bind } from "bind-event-listener";

// import { jsx } from "@emotion/core";

import {
  AtlassianNavigation,
  Create,
  Help,
  PrimaryButton,
  ProductHome,
} from "@atlaskit/atlassian-navigation";
import { ConfluenceIcon, ConfluenceLogo } from "@atlaskit/logo";
import { ButtonItem, MenuGroup, Section } from "@atlaskit/menu";
import Popup from "@atlaskit/popup";
import {
  Header,
  NavigationHeader,
  NestableNavigationContent,
  NestingItem,
  SideNavigation,
} from "@atlaskit/side-navigation";

import {
  Content,
  LeftSidebar,
  Main,
  PageLayout,
  TopNavigation,
  usePageLayoutResize,
} from "@atlaskit/page-layout";
import { SlotLabel, SlotWrapper } from "./page-layout/common";
import ToDoList from "./components/ToDoList/ToDoList";
import TopNavigationContents from "./components/topNavigationContents/topNavigationContents";
import PageHeaderComplex from "./components/pageHeader/pageHeader";

import Tooltip from "@atlaskit/tooltip";

import FileList from "./components/modal/taskInfo/components/fileList/fileList";

import UserService from "./services/UserService";

export default function App() {
  // if (UserService.isLoggedIn()) {
  //   console.log("g");
  // } else {
  //   UserService.doLogin();
  // }
  return (
    // <div>
    //   <FileList></FileList>
    // </div>
    <PageLayout>
      <TopNavigation
        isFixed={true}
        id="confluence-navigation"
        skipLinkTitle="Confluence Navigation"
      >
        <TopNavigationContents></TopNavigationContents>
      </TopNavigation>
      <Content testId="content">
        <LeftSidebar
          isFixed={false}
          width={230}
          id="project-navigation"
          skipLinkTitle="Project Navigation"
          testId="left-sidebar"
          overrides={{
            ResizeButton: {
              render: (Component, props) => (
                <Tooltip
                  content={
                    props.isLeftSidebarCollapsed ? "Раскрыть [" : "Скрыть ]"
                  }
                  hideTooltipOnClick
                  position="right"
                  testId="tooltip"
                >
                  <Component {...props} />
                </Tooltip>
              ),
            },
          }}
        >
          <SideNavigationContent />
          <ExpandKeyboardShortcut />
        </LeftSidebar>
        <Main id="main-content" skipLinkTitle="Main Content">
          <SlotWrapper>
            <SlotLabel>
              <PageHeaderComplex></PageHeaderComplex>
              <ToDoList></ToDoList>
            </SlotLabel>
          </SlotWrapper>
        </Main>
      </Content>
    </PageLayout>
  );
}

const ExpandKeyboardShortcut = () => {
  const { isLeftSidebarCollapsed, expandLeftSidebar, collapseLeftSidebar } =
    usePageLayoutResize();

  const toggleSidebarCollapse = useCallback(() => {
    if (isLeftSidebarCollapsed) {
      expandLeftSidebar();
    } else {
      collapseLeftSidebar();
    }
  }, [isLeftSidebarCollapsed, expandLeftSidebar, collapseLeftSidebar]);

  useEffect(() => {
    const toggle = (event: any) => {
      if (event.which === 219) {
        toggleSidebarCollapse();
      }
    };

    return bind(document, {
      type: "keydown",
      listener: toggle,
    });
  }, [toggleSidebarCollapse]);

  return null;
};

// function TopNavigationContents() {
//   return (
//     <AtlassianNavigation
//       label="site"
//       moreLabel="More"
//       primaryItems={[
//         <PrimaryButton isHighlighted>Item 1</PrimaryButton>,
//         <PrimaryButton>Item 2</PrimaryButton>,
//         <PrimaryButton>Item 3</PrimaryButton>,
//         <PrimaryButton>Item 4</PrimaryButton>,
//       ]}
//       renderProductHome={ProductHomeExample}
//       renderCreate={DefaultCreate}
//       renderHelp={HelpPopup}
//     />
//   );
// }

const SideNavigationContent = () => {
  return (
    <SideNavigation label="Project navigation" testId="side-navigation">
      <NavigationHeader>
        <Header description="Sidebar header description">Sidebar Header</Header>
      </NavigationHeader>
      <NestableNavigationContent initialStack={[]}>
        <Section>
          <NestingItem id="1" title="Nested Item">
            <Section title="Group 1">
              <ButtonItem>Item 1</ButtonItem>
              <ButtonItem>Item 2</ButtonItem>
            </Section>
          </NestingItem>
        </Section>
      </NestableNavigationContent>
    </SideNavigation>
  );
};

/*
 * Components for composing top and side navigation
 */

export const DefaultCreate = () => (
  <Create
    buttonTooltip="Create"
    iconButtonTooltip="Create"
    onClick={() => {}}
    text="Create"
  />
);

const ProductHomeExample = () => (
  <ProductHome
    onClick={console.log}
    icon={ConfluenceIcon}
    logo={ConfluenceLogo}
    siteTitle="Product"
  />
);

export const HelpPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {
    setIsOpen(!isOpen);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <Popup
      placement="bottom-start"
      content={HelpPopupContent}
      isOpen={isOpen}
      onClose={onClose}
      trigger={(triggerProps) => (
        <Help
          isSelected={isOpen}
          onClick={onClick}
          tooltip="Help"
          {...triggerProps}
        />
      )}
    />
  );
};

const HelpPopupContent = () => (
  <MenuGroup>
    <Section title={"Menu Heading"}>
      <ButtonItem>Item 1</ButtonItem>
      <ButtonItem>Item 2</ButtonItem>
      <ButtonItem>Item 3</ButtonItem>
      <ButtonItem>Item 4</ButtonItem>
    </Section>
    <Section title="Menu Heading with separator" hasSeparator>
      <ButtonItem>Item 5</ButtonItem>
      <ButtonItem>Item 6</ButtonItem>
    </Section>
  </MenuGroup>
);
