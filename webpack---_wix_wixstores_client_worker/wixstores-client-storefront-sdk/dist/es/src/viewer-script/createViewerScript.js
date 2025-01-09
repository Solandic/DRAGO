import { __assign, __awaiter, __generator } from "tslib";
import { StoresWidgetID, MINICART_POPUP_URL, VIEWER_SCRIPT_DSN } from '@wix/wixstores-client-core';
import { SiteStore } from './site-store/SiteStore';
import { setSentryInstance, createControllerRaven, createFakeRaven, withErrorReporting, withErrorReportingWrapping, errorReporter, } from './errorReporter';
import { sentryConfPerController } from './sentryConf';
import { isWorker } from './utils';
import { getReleaseFromBaseUrl } from '@wix/native-components-infra';
import { createWixcodeExports as createPublicApiExports } from './wixcode/createWixcodeExports';
import { SPECS } from '../constants';
import { CurrentCartService } from './current-cart-service/CurrentCartService';
import { SideCartCurrentCartService } from './current-cart-service/SideCartCurrentCartService';
var MINI_CART_ID = 'comp-lkw4qne1';
function emptyCtrl() {
    return {
        pageReady: /* istanbul ignore next: todo: test */ function () {
            //
        },
        exports: /* istanbul ignore next: todo: test */ function () { return ({}); },
    };
}
var defaultOptions = {
    useWorkerRaven: true,
};
function openPopup(config, siteStore) {
    var popupUrl = MINICART_POPUP_URL;
    var cartIconConf = config.filter(function (c) { return c.type === StoresWidgetID.CART_ICON; });
    if (cartIconConf.length && cartIconConf[0].config.externalId) {
        popupUrl += "?externalId=".concat(cartIconConf[0].config.externalId);
    }
    //eslint-disable-next-line @typescript-eslint/no-floating-promises
    siteStore.windowApis.openPersistentPopup(popupUrl, {
        theme: 'BARE',
        width: '0%',
        height: '100%',
        position: {
            origin: 'FIXED',
            placement: 'TOP_RIGHT',
            x: 0,
            y: 0,
        },
    }, (cartIconConf.length && cartIconConf[0].compId) || config[0].compId);
}
function getControllerFactory(controllerInstances, controllerFactories, type) {
    var ctrlFactory;
    if (controllerInstances === null || controllerInstances === void 0 ? void 0 : controllerInstances[type]) {
        var controllerFunction = Object.keys(controllerInstances[type]).filter(function (k) {
            return k.toLowerCase().includes('controller');
        })[0];
        var sentryConf = sentryConfPerController[type];
        ctrlFactory = __assign({ factory: controllerInstances[type][controllerFunction] }, (sentryConf ? { sentryDSN: sentryConf.dsn, baseUrlKey: sentryConf.baseUrlsKey } : {}));
        // @ts-expect-error
    }
    else if (controllerFactories === null || controllerFactories === void 0 ? void 0 : controllerFactories[type]) {
        // @ts-expect-error
        ctrlFactory = controllerFactories[type];
    }
    // @ts-expect-error
    return ctrlFactory;
}
function isMiniCartEnabledFromEditorSettings(controllerConfigs) {
    var _a, _b, _c, _d;
    var miniCartController = controllerConfigs.find(function (controller) { return controller.compId === MINI_CART_ID; });
    /* istanbul ignore next */
    var iconLink = (_d = (_c = (_b = (_a = miniCartController === null || miniCartController === void 0 ? void 0 : miniCartController.config) === null || _a === void 0 ? void 0 : _a.style) === null || _b === void 0 ? void 0 : _b.styleParams) === null || _c === void 0 ? void 0 : _c.numbers) === null || _d === void 0 ? void 0 : _d.iconLink;
    return !iconLink || iconLink === 2;
}
function initController(ctrlFactory, context, props) {
    return __awaiter(this, void 0, void 0, function () {
        var baseUrl, release, monitoring, reportError, setPropsWithErrorsReporting, ctrl, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!ctrlFactory) {
                        return [2 /*return*/, emptyCtrl()];
                    }
                    baseUrl = ctrlFactory.baseUrlKey && context.siteStore.baseUrls[ctrlFactory.baseUrlKey];
                    release = baseUrl &&
                        getReleaseFromBaseUrl(baseUrl, {
                            artifactName: true,
                        });
                    monitoring = ctrlFactory.sentryDSN
                        ? context.createMonitoring(ctrlFactory.sentryDSN, {
                            release: release,
                        })
                        : createFakeRaven();
                    reportError = function (exception, options) {
                        /* istanbul ignore else */
                        if (process.env.NODE_ENV === 'test') {
                            console.error('Error in viewer script:\n', exception);
                        }
                        return monitoring(exception, options);
                    };
                    setPropsWithErrorsReporting = function (p) {
                        var errorBoundaryProps = {
                            sentryRelease: release,
                            ravenUserContextOverrides: {
                                id: context.siteStore.storeId,
                                uuid: context.siteStore.uuid,
                            },
                        };
                        props.setProps(__assign(__assign({}, errorBoundaryProps), withErrorReporting(reportError)(p)));
                    };
                    ctrl = ctrlFactory.factory({
                        config: props.config,
                        compId: props.compId,
                        context: context,
                        setProps: setPropsWithErrorsReporting,
                        platformAPIs: props.platformAPIs,
                        reportError: reportError,
                        type: props.type,
                        warmupData: props.warmupData,
                        wixCodeApi: props.wixCodeApi,
                        // Fields needed for editor flow integration,
                        controllerConfig: props,
                        appData: {
                            context: context,
                            __prepopulated: {
                                experiments: context.siteStore.experiments.all(),
                                biLogger: context.siteStore.biLogger,
                            },
                            reportError: reportError,
                        },
                    });
                    _a = withErrorReporting(reportError);
                    return [4 /*yield*/, ctrl];
                case 1: 
                // eslint-disable-next-line @typescript-eslint/await-thenable
                return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
            }
        });
    });
}
export function createViewerScript(controllerFactories, options) {
    if (options === void 0) { options = {}; }
    var context = {
        controllerConfigs: [],
    };
    options = __assign(__assign({}, defaultOptions), options);
    return withErrorReportingWrapping({
        initAppForPage: function (initParams, apis, namespaces, platformServices) {
            var userMonitoringContext = {
                id: initParams.instanceId,
                url: namespaces.location.baseUrl,
                uuid: platformServices.bi.visitorId,
            };
            context.siteStore = new SiteStore(initParams, apis, namespaces, platformServices);
            if (options.useWorkerRaven) {
                var sentryInstance = platformServices.monitoring.createMonitor(VIEWER_SCRIPT_DSN, function (data) {
                    data.environment = 'Worker';
                    data.release =
                        initParams.url &&
                            getReleaseFromBaseUrl(initParams.url, {
                                artifactName: true,
                            });
                    return data;
                });
                sentryInstance.setUserContext(userMonitoringContext);
                setSentryInstance(sentryInstance);
                context.createMonitoring = createControllerRaven(platformServices, userMonitoringContext, context.siteStore);
            }
            else {
                context.createMonitoring = createFakeRaven();
            }
            var isLightbox = !!context.siteStore.windowApis.lightbox.getContext();
            context.currentCartService = isLightbox
                ? new SideCartCurrentCartService({ context: context, apis: apis })
                : new CurrentCartService({ context: context, apis: apis, initParams: initParams });
            if (!context.siteStore.isSSR()) {
                context.currentCartService.init();
            }
            return context.siteStore
                .loadClientConfig()
                .then(function () { return context; })
                .catch(errorReporter);
        },
        createControllers: function (controllerConfigs, controllerInstances) {
            var allowMobile = !context.siteStore.isMobile() || context.siteStore.experiments.enabled(SPECS.AllowMobileTinyCartInViewer);
            var cartExists = context.siteStore.isCartExists;
            var isViewer = context.siteStore.isSiteMode() || context.siteStore.isPreviewMode();
            var loadMiniCart = context.siteStore.experiments.enabled(SPECS.AvoidLoadingMiniCartForDisabledSites) &&
                isMiniCartEnabledFromEditorSettings(controllerConfigs);
            var isLightbox = !!context.siteStore.windowApis.lightbox.getContext();
            var shouldOpenMiniCart = allowMobile && isViewer && isWorker() && cartExists && !isLightbox;
            context.controllerConfigs = controllerConfigs;
            if ((context.siteStore.experiments.enabled(SPECS.AvoidLoadingMiniCartForDisabledSites) &&
                loadMiniCart &&
                shouldOpenMiniCart) ||
                (!context.siteStore.experiments.enabled(SPECS.AvoidLoadingMiniCartForDisabledSites) && shouldOpenMiniCart)) {
                openPopup(controllerConfigs, context.siteStore);
            }
            if (controllerConfigs.filter(function (c) { return c.type === StoresWidgetID.CART_ICON; }).length) {
                context.siteStore.isCartIconExists = true;
            }
            return controllerConfigs.map(function (props) {
                // @ts-expect-error
                var ctrlFactory = getControllerFactory(controllerInstances, controllerFactories, props.type);
                var ctrl = initController(ctrlFactory, context, props);
                return Promise.resolve(ctrl);
            });
        },
        exports: createPublicApiExports({ context: context, origin: 'wixcode' }),
    });
}
//# sourceMappingURL=createViewerScript.js.map