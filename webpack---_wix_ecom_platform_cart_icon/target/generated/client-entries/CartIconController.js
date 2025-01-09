
  import userController from '/home/builduser/work/18b508ac43996097/packages/ecom-platform-cart-icon/src/components/CartIcon/controller.ts';
  import createControllerWrapper from '@wix/yoshi-flow-editor/runtime/esm/controllerWrapper.js';

  
const wrapController = null;


  
var createHttpClient = null;

  

  import { initI18nWithoutICU as initI18n } from '@wix/yoshi-flow-editor/runtime/esm/i18next/init';


  
const multilingualDisabled = false;

  

    var createExperiments = null;
    var createWidgetExperiments = null;
    


  var sentryConfig = {
    DSN: 'https://e27a8d4ddc0b4cddbb88c8eafad23b21@sentry.wixpress.com/4950',
    id: 'e27a8d4ddc0b4cddbb88c8eafad23b21',
    projectName: 'ecom-platform-cart-icon',
    teamName: 'wixstores',
    errorMonitor: true,
  };

  var experimentsConfig = {"scopes":["stores","viewer-apps-1380b703-ce81-ff05-f115-39571d94dfcd"],"centralized":true};

  var translationsConfig = {"icuEnabled":false,"defaultTranslationsPath":"/home/builduser/work/18b508ac43996097/packages/ecom-platform-cart-icon/src/assets/locales/messages_en.json","availableLanguages":["ar","bg","ca","cs","da","de","el","en","es","fi","fr","he","hi","hr","hu","id","it","ja","ko","lt","lv","ms","nl","no","pl","pt","ro","ru","sk","sl","sv","th","tl","tr","uk","vi","zh"]};

  var biConfig = null;

  var defaultTranslations = {"CART_ICON_3":"CART","CART_ICON_4":"Cart","CART_ICON_5":"Cart","CART_ICON_7":"Cart","sr.CART_WIDGET_BUTTON_TEXT":"Cart with {{itemsCount}} items"};

  var fedopsConfig = null;

  import { createVisitorBILogger as biLogger } from '/home/builduser/work/18b508ac43996097/packages/ecom-platform-cart-icon/target/generated/bi/createBILogger.ts';

  const controllerOptions = {
    sentryConfig,
    biConfig,
    fedopsConfig,
    experimentsConfig,
    biLogger,
    translationsConfig,
    persistentAcrossPages: false,
    appName: "CART ICON OOI",
    componentName: "CartIcon",
    appDefinitionId: "1380b703-ce81-ff05-f115-39571d94dfcd",
    componentId: "1380bbc4-1485-9d44-4616-92e36b1ead6b",
    projectName: "ecom-platform-cart-icon",
    defaultTranslations,
    multilingualDisabled,
    shouldUseEssentials: true,
    withErrorBoundary: false,
    localeDistPath: "assets/locales"
  };

  const _controller = createControllerWrapper(userController, controllerOptions, {
    initI18n,
    createHttpClient,
    createExperiments,
  });

  export const wrap = wrapController;
  export const descriptor = {
    ...controllerOptions,
    id: controllerOptions.componentId,
    widgetType: "WIDGET_OUT_OF_IFRAME",
    controllerFileName: "/home/builduser/work/18b508ac43996097/packages/ecom-platform-cart-icon/src/components/CartIcon/controller.ts",
  };

  export const controller = _controller
  export default controller;
