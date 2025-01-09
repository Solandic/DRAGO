import { MEMBERS_AREA_V2 } from '@wix/app-definition-ids';

import type {
  PageService as IPageService,
  WixCodeApi,
} from '../../../../types';

export class PageService implements IPageService {
  constructor(
    private readonly siteAPI: Pick<WixCodeApi['site'], 'getSiteStructure'>,
  ) {}

  async getMembersAreaPagePrefix() {
    const { prefixes } = await this.siteAPI.getSiteStructure();
    const membersAreaPagePrefixData = prefixes.find(
      ({ applicationId }) => applicationId === MEMBERS_AREA_V2,
    );

    if (!membersAreaPagePrefixData) {
      throw new Error(
        'Error: missing members area page - failed to find prefix',
      );
    }

    return membersAreaPagePrefixData.prefix;
  }
}
