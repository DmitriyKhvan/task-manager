import { Fragment } from "react";

import { jsx } from "@emotion/core";

import { JiraIcon, JiraLogo } from "@atlaskit/logo";

import {
  AtlassianNavigation,
  ProductHome,
} from "@atlaskit/atlassian-navigation";
import {
  SkeletonCreateButton,
  SkeletonIconButton,
  SkeletonPrimaryButton,
} from "@atlaskit/atlassian-navigation/skeleton";
import "./topNavigationContents.scss";
import UserService from "../../services/UserService";
// import { SkeletonHelpButton } from "../../src/skeleton-help-button";
// import { SkeletonNotificationButton } from "../../src/skeleton-notification-button";
// import { SkeletonSettingsButton } from "../../src/skeleton-settings-button";
// import { SkeletonSwitcherButton } from "../../src/skeleton-switcher-button";
// import { avatarUrl } from "../shared/ProfilePopup";

const SkeletonCreate = () => (
  <SkeletonCreateButton text="Create"></SkeletonCreateButton>
);
const SkeletonProfileButton = () => (
  <SkeletonIconButton>
    {/* <img src={avatarUrl} alt="Your profile and settings" /> */}
  </SkeletonIconButton>
);
const skeletonPrimaryItems = [
  <SkeletonPrimaryButton>Home</SkeletonPrimaryButton>,
  <SkeletonPrimaryButton isDropdownButton text="Projects" />,
  <SkeletonPrimaryButton
    isDropdownButton
    isHighlighted
    text="Filters &amp; issues"
  />,
  <SkeletonPrimaryButton isDropdownButton text="Dashboards" />,
  <SkeletonPrimaryButton isDropdownButton text="Apps" testId="apps-skeleton" />,
  <button
    className="header-user-info-actions-item"
    onClick={UserService.doLogout}
  >
    Выйти
  </button>,
];

const TopNavigationContents = () => {
  return (
    <div className="topNav">
      <AtlassianNavigation
        label="site"
        moreLabel="More"
        primaryItems={skeletonPrimaryItems}
        // renderAppSwitcher={() => (
        //   <SkeletonSwitcherButton label="switcher button" />
        // )}
        renderCreate={SkeletonCreate}
        renderProductHome={() => (
          <ProductHome icon={JiraIcon} logo={JiraLogo} siteTitle="Hello" />
        )}
        renderProfile={SkeletonProfileButton}
        // renderSettings={() => (
        //   <SkeletonSettingsButton label="settings button" />
        // )}
        // renderHelp={() => <SkeletonHelpButton label="help button" />}
        // renderNotifications={() => (
        //   <SkeletonNotificationButton label="notifications button" />
        // )}
        testId="atlassian-navigation"
      />
    </div>
  );
};

export default TopNavigationContents;
