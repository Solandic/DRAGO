import type { ConfigItemV1, ConfigItemV2, ParsedConfigItem } from '../types';

export function parseConfigItems(config: ConfigItemV1[] | ConfigItemV2[]) {
  if (!config || !config[0]) {
    return [];
  }
  const isV1 = Object.keys(config[0]).includes('isVisible');
  return isV1
    ? parseV1Config(config as ConfigItemV1[])
    : parseV2Config(config as ConfigItemV2[]);
}

function parseV1Config(config: ConfigItemV1[]): ParsedConfigItem[] {
  return config.map((item) => ({
    link: item.link,
    isVisibleInMenuBar: item.isVisible,
    isVisibleInMobileMenuBar: item.isVisibleMobile,
    visibleForRoles: item.visibleForRoles,
  }));
}

function parseV2Config(config: ConfigItemV2[]): ParsedConfigItem[] {
  return config.map((item) => ({
    link: item.l,
    isVisibleInMenuBar: !item.hmb,
    isVisibleInMobileMenuBar: !item.hmmb,
    visibleForRoles: item.vfr || [],
  }));
}
