import { MULTI_LANG_HEADER_NAME, CSRF_HEADER_NAME, FetchAdapter, WixStoresHttp, } from '@wix/wixstores-client-core';
import { SPECS } from '../../constants';
import { QueryParamsService } from '../../services/QueryParamsService/QueryParamsService';
import { stripGraphql } from '../utils';
import { InstanceManager } from './InstanceManager';
var EcomHttpClient = /** @class */ (function () {
    function EcomHttpClient(_a) {
        var _b, _c;
        var wixCodeApi = _a.wixCodeApi, instance = _a.instance, storeId = _a.storeId, csrfToken = _a.csrfToken, essentials = _a.essentials, experiments = _a.experiments;
        var _this = this;
        this.storeId = storeId;
        this.csrfToken = csrfToken;
        this.essentials = essentials;
        this.wixCodeApi = wixCodeApi;
        this.experiments = experiments;
        this.fetchAdapter = new FetchAdapter();
        this.instanceManager = new InstanceManager(instance);
        this.httpClient = new WixStoresHttp(this.instanceManager, this.fetchAdapter, function () { return _this.getCurrencyHeader(); });
        var multiLangHeader = this.getMultiLangHeader();
        if (multiLangHeader) {
            this.httpClient.addHeaders((_b = {}, _b[MULTI_LANG_HEADER_NAME] = multiLangHeader, _b));
        }
        /* istanbul ignore next: todo: test */
        if (this.csrfToken) {
            this.httpClient.addHeaders((_c = {}, _c[CSRF_HEADER_NAME] = this.csrfToken, _c));
        }
    }
    /* istanbul ignore next: todo: test */
    EcomHttpClient.prototype.tryGetGqlAndFallbackToPost = function (url, bodyData, options) {
        var _this = this;
        var strippedQuery = stripGraphql(bodyData.query);
        if (this.isSSR()) {
            strippedQuery = encodeURIComponent(strippedQuery);
        }
        var urlWithParams = "".concat(url, "?o=").concat(bodyData.operationName, "&s=").concat(bodyData.source, "&q=").concat(strippedQuery);
        if (bodyData.variables) {
            urlWithParams += "&v=".concat(encodeURIComponent(JSON.stringify(bodyData.variables)));
        }
        var shouldForceGet = this.experiments.enabled(SPECS.IncreaseGqlGetLimit);
        var urlLimit = shouldForceGet ? 8000 : 2040;
        if (urlWithParams.length < urlLimit || this.isSSR()) {
            return this.httpClient
                .get(urlWithParams, {}, false, false)
                .catch(function () { return _this.httpClient.post(url, bodyData, options); });
        }
        else {
            return this.httpClient.post(url, bodyData, options);
        }
    };
    EcomHttpClient.prototype.resolveAbsoluteUrl = function (path) {
        var _a, _b;
        /* istanbul ignore next */
        var shouldUseOnlyBaseUrlAsOrigin = (_b = (_a = this.essentials) === null || _a === void 0 ? void 0 : _a.experiments) === null || _b === void 0 ? void 0 : _b.enabled(SPECS.ShouldUseOnlyBaseUrlAsOrigin);
        return this.isSSR() || shouldUseOnlyBaseUrlAsOrigin ? "".concat(this.getOrigin()).concat(path) : path;
    };
    EcomHttpClient.prototype.getOrigin = function () {
        var _a, _b;
        var baseUrl = this.wixCodeApi.location.baseUrl;
        /* istanbul ignore next */
        var shouldUseOnlyBaseUrlAsOrigin = (_b = (_a = this.essentials) === null || _a === void 0 ? void 0 : _a.experiments) === null || _b === void 0 ? void 0 : _b.enabled(SPECS.ShouldUseOnlyBaseUrlAsOrigin);
        if (shouldUseOnlyBaseUrlAsOrigin) {
            return baseUrl;
        }
        var baseUrlParts = baseUrl.split('/');
        return baseUrlParts.slice(0, 3).join('/');
    };
    EcomHttpClient.prototype.getCurrencyHeader = function () {
        var fields = this.getCurrencyFields();
        return fields ? "".concat(fields.currencyCode) : '';
    };
    EcomHttpClient.prototype.getMultiLangHeader = function () {
        var fields = this.getMultiLangFields();
        return fields ? "".concat(fields.lang, "|").concat(fields.locale, "|").concat(fields.isPrimaryLanguage.toString(), "|").concat(this.storeId) : '';
    };
    EcomHttpClient.prototype.getMultiLangFields = function () {
        var currentShortLang = this.wixCodeApi.window.multilingual.currentLanguage;
        var currentLang = this.getCurrentlyUsedMultilingualLanguage();
        if (!currentLang) {
            return null;
        }
        return {
            isPrimaryLanguage: currentLang.isPrimaryLanguage,
            lang: currentShortLang,
            locale: currentLang.locale,
        };
    };
    EcomHttpClient.prototype.getCurrentlyUsedMultilingualLanguage = function () {
        var currentShortLang = this.wixCodeApi.window.multilingual.currentLanguage;
        return this.wixCodeApi.window.multilingual.siteLanguages.find(function (lang) { return lang.languageCode === currentShortLang; });
    };
    EcomHttpClient.prototype.getCurrencyFields = function () {
        var currencyCode = new QueryParamsService({ location: this.wixCodeApi.location }).getQueryParam('currency');
        return currencyCode ? { currencyCode: currencyCode } : null;
    };
    EcomHttpClient.prototype.isSSR = function () {
        return this.wixCodeApi.window.rendering.env === 'backend';
    };
    return EcomHttpClient;
}());
export { EcomHttpClient };
//# sourceMappingURL=EcomHttpClient.js.map