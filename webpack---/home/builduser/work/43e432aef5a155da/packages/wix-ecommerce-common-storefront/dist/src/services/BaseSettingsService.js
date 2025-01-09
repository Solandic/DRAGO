"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSettingsService = void 0;
var siteEvent_1 = require("../enums/siteEvent");
var UPDATE_SETTINGS_TIMEOUT = 100;
var BaseSettingsService = /** @class */ (function () {
    function BaseSettingsService(sdkSettings, sdkEvents, $q, $timeout) {
        this.sdkSettings = sdkSettings;
        this.sdkEvents = sdkEvents;
        this.$q = $q;
        this.$timeout = $timeout;
        this.onSettingsChangePromise = null;
        //
    }
    BaseSettingsService.prototype.convertSettings = function (_settings) {
        throw new Error('convertSettings is an abstract method');
    };
    BaseSettingsService.prototype.getSettings = function () {
        var _this = this;
        var defer = this.$q.defer();
        this.sdkSettings.getSavedSettings(function (settings) {
            defer.resolve(_this.convertSettings(settings));
        });
        return defer.promise;
    };
    BaseSettingsService.prototype.onSettingsChange = function (callback) {
        var _this = this;
        this.sdkEvents.onSiteEvent(siteEvent_1.siteEventTypeEnum.STYLE_PARAMS_CHANGE, function (settings) {
            if (_this.onSettingsChangePromise !== null) {
                _this.$timeout.cancel(_this.onSettingsChangePromise);
            }
            _this.onSettingsChangePromise = _this.$timeout(function () {
                callback(_this.convertSettings(settings));
                _this.onSettingsChangePromise = null;
            }, UPDATE_SETTINGS_TIMEOUT);
        });
    };
    return BaseSettingsService;
}());
exports.BaseSettingsService = BaseSettingsService;
