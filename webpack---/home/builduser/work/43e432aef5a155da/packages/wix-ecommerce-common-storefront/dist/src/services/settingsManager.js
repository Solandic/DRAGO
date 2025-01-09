"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsManager = exports.ML_KEYS_PREFIX = exports.ScopeType = void 0;
var getLocaleNamespace_1 = require("../multilingual/getLocaleNamespace");
var ScopeType;
(function (ScopeType) {
    ScopeType["COMPONENT"] = "COMPONENT";
    ScopeType["APP"] = "APP";
})(ScopeType = exports.ScopeType || (exports.ScopeType = {}));
exports.ML_KEYS_PREFIX = 'multilingual';
var SettingsManager = /** @class */ (function () {
    /* @ngInject */
    SettingsManager.$inject = ["sdkAdapter", "experimentManager", "clientConfig", "appSettings", "$q", "$rootScope", "MULTILINGUAL_LANGUAGE", "appClientService"];
    function SettingsManager(sdkAdapter, experimentManager, clientConfig, appSettings, $q, $rootScope, MULTILINGUAL_LANGUAGE, appClientService) {
        this.sdkAdapter = sdkAdapter;
        this.experimentManager = experimentManager;
        this.clientConfig = clientConfig;
        this.appSettings = appSettings;
        this.$q = $q;
        this.$rootScope = $rootScope;
        this.MULTILINGUAL_LANGUAGE = MULTILINGUAL_LANGUAGE;
        this.appClientService = appClientService;
    }
    SettingsManager.prototype.onAppSettingsChange = function (callbackFunc) {
        var _this = this;
        this.appClientService.onChange(function (appSettingsData) {
            var localeNamespace = (0, getLocaleNamespace_1.getLocaleNamespace)(_this.MULTILINGUAL_LANGUAGE);
            var texts = appSettingsData[localeNamespace] || {};
            var appSettingsDataKeys = Object.keys(appSettingsData);
            var data = {};
            appSettingsDataKeys = appSettingsDataKeys.filter(function (key) { return key.indexOf(exports.ML_KEYS_PREFIX) !== 0; });
            appSettingsDataKeys.forEach(function (key) {
                data[key] = appSettingsData[key];
            });
            _this.$rootScope.$apply(function () {
                callbackFunc({ texts: texts, data: data });
            });
        });
    };
    SettingsManager.prototype.getSettingsTexts = function (_a) {
        var _this = this;
        var _b = _a.translatableKeys, translatableKeys = _b === void 0 ? [] : _b, _c = _a.nonTranslatableKeys, nonTranslatableKeys = _c === void 0 ? [] : _c, _d = _a.scope, scope = _d === void 0 ? ScopeType.COMPONENT : _d, freeTexts = _a.freeTexts;
        var sdkKeys, multilingualKeys;
        if (this.clientConfig.isPrimaryLanguage) {
            sdkKeys = __spreadArray(__spreadArray([], nonTranslatableKeys, true), translatableKeys, true);
            multilingualKeys = [];
        }
        else {
            sdkKeys = __spreadArray([], nonTranslatableKeys, true);
            multilingualKeys = __spreadArray([], translatableKeys, true);
        }
        var promise = this.$q.when();
        if (sdkKeys.length) {
            if (scope === ScopeType.APP) {
                promise = this.sdkAdapter.getMultiPublicDataForApp(sdkKeys);
            }
            else {
                promise = this.sdkAdapter.getMultiPublicData(sdkKeys);
            }
        }
        return promise.then(function (sdkData) {
            var result = {};
            if (typeof sdkData === 'object' && sdkData !== 'undefined') {
                result = __assign({}, _this.mapPublicData(sdkData, sdkKeys));
            }
            if (multilingualKeys.length) {
                result = __assign(__assign({}, result), _this.getSecondaryLanguageFreeTexts(freeTexts));
            }
            return result;
        });
    };
    SettingsManager.prototype.getSecondaryLanguageFreeTexts = function (freeTexts) {
        if (freeTexts) {
            return freeTexts;
        }
        else {
            var localeNamespace = (0, getLocaleNamespace_1.getLocaleNamespace)(this.MULTILINGUAL_LANGUAGE);
            return this.appSettings[localeNamespace] || {};
        }
    };
    SettingsManager.prototype.mapPublicData = function (publicData, keysToExtract) {
        var freeTexts = {};
        keysToExtract.map(function (key, index) {
            var currentData = publicData[index];
            if (typeof currentData === 'string' || (typeof currentData === 'object' && !currentData.error)) {
                freeTexts[key] = currentData;
            }
            else {
                freeTexts[key] = null;
            }
        });
        return freeTexts;
    };
    return SettingsManager;
}());
exports.SettingsManager = SettingsManager;
