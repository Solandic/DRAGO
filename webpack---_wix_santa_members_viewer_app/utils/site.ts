import { MEMBERS_AREA_V2 } from '@wix/app-definition-ids';
import type { IWixAPI } from '@wix/yoshi-flow-editor';

export const isProfilePageBoBInstalled = async (wixCodeApi: IWixAPI | null) => {
  return !!(await wixCodeApi?.site.isAppSectionInstalled({
    sectionId: 'member_page',
    appDefinitionId: MEMBERS_AREA_V2,
  }));
};

export const isSettingsPageInstalled = async (wixCodeApi: IWixAPI | null) => {
  if (wixCodeApi) {
    return wixCodeApi.site.isAppSectionInstalled({
      sectionId: 'member_settings_page',
      appDefinitionId: MEMBERS_AREA_V2,
    });
  }

  return false;
};
