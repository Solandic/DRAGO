"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.siteEventTypeEnum = void 0;
var siteEventTypeEnum;
(function (siteEventTypeEnum) {
    siteEventTypeEnum[siteEventTypeEnum["EDIT_MODE_CHANGE"] = 0] = "EDIT_MODE_CHANGE";
    siteEventTypeEnum[siteEventTypeEnum["PAGE_NAVIGATION"] = 1] = "PAGE_NAVIGATION";
    siteEventTypeEnum[siteEventTypeEnum["PAGE_NAVIGATION_IN"] = 2] = "PAGE_NAVIGATION_IN";
    siteEventTypeEnum[siteEventTypeEnum["PUBLIC_DATA_CHANGED"] = 3] = "PUBLIC_DATA_CHANGED";
    siteEventTypeEnum[siteEventTypeEnum["COMPONENT_DELETED"] = 4] = "COMPONENT_DELETED";
    siteEventTypeEnum[siteEventTypeEnum["STYLE_PARAMS_CHANGE"] = 5] = "STYLE_PARAMS_CHANGE";
    siteEventTypeEnum[siteEventTypeEnum["SITE_SCROLL"] = 6] = "SITE_SCROLL";
    siteEventTypeEnum[siteEventTypeEnum["SETTINGS_UPDATED"] = 7] = "SETTINGS_UPDATED";
})(siteEventTypeEnum = exports.siteEventTypeEnum || (exports.siteEventTypeEnum = {}));
