
  import {createControllersWithDescriptors, initAppForPageWrapper} from '@wix/yoshi-flow-editor/runtime/esm/viewerScript/wrapper.js';
  
  
            
import wrapController0 from '@wix/yoshi-flow-editor-runtime/internal/viewerScript/platform';

            import controller0 from '/home/builduser/work/d58756a41851642f/packages/members-viewer-app/src/components/members/controller.ts';
            import * as _controllerExport0 from '/home/builduser/work/d58756a41851642f/packages/members-viewer-app/src/components/members/controller.ts';
            var controllerExport0 = _controllerExport0;
            

            
import wrapController1 from '@wix/yoshi-flow-editor-runtime/internal/viewerScript/platform';

            import controller1 from '/home/builduser/work/d58756a41851642f/packages/members-viewer-app/src/components/members-login-bar/controller.ts';
            import * as _controllerExport1 from '/home/builduser/work/d58756a41851642f/packages/members-viewer-app/src/components/members-login-bar/controller.ts';
            var controllerExport1 = _controllerExport1;
            

            
import wrapController2 from '@wix/yoshi-flow-editor-runtime/internal/viewerScript/platform';

            import controller2 from '/home/builduser/work/d58756a41851642f/packages/members-viewer-app/src/components/members-menu/controller.ts';
            import * as _controllerExport2 from '/home/builduser/work/d58756a41851642f/packages/members-viewer-app/src/components/members-menu/controller.ts';
            var controllerExport2 = _controllerExport2;
            

  
  import * as viewerApp from '/home/builduser/work/d58756a41851642f/packages/members-viewer-app/src/viewer.app.ts';
    var importedApp = viewerApp;


  

    import { initState, initBind } from '@wix/yoshi-flow-editor/runtime/esm/velocycleMobx';
    import { observable } from 'mobx';
    var velocycleMobx = { initState, initBind, observable };
    


  

    var blocksControllerService = null;
    

  
var createHttpClient = null;

  
var initI18n = null;

  
const multilingualDisabled = false;

  

    var createExperiments = null;
    var createWidgetExperiments = null;
    


  var sentryConfig = {
      DSN: 'https://1447e27dc6864379bd4824d259480b74@sentry-next.wixpress.com/7858',
      id: 'undefined',
      projectName: 'santa-members-viewer-app',
      teamName: 'undefined',
      errorMonitor: true,
    };

  var experimentsConfig = {"scopes":["members-area"],"centralized":true};

  var translationsConfig = {"enabled":false,"icuEnabled":false};

  var defaultTranslations = null;

  var fedopsConfig = null;

  import { createVisitorBILogger as biLogger } from '/home/builduser/work/d58756a41851642f/packages/members-viewer-app/target/generated/bi/createBILogger.ts';

  export const exports = importedApp.exports;

  export const initAppForPage = initAppForPageWrapper({
    initAppForPage: importedApp.initAppForPage,
    sentryConfig: sentryConfig,
    experimentsConfig: experimentsConfig,
    inEditor: false,
    biLogger: biLogger,
    multilingualDisabled,
    projectName: "santa-members-viewer-app",
    biConfig: null,
    appName: "Members Area Viewer Script",
    appDefinitionId: "14cc59bc-f0b7-15b8-e1c7-89ce41d0e0c9",
    fedopsConfig: fedopsConfig,
    translationsConfig: translationsConfig,
    defaultTranslations: defaultTranslations,
    shouldUseEssentials: true,
    optionalDeps: {
      initI18n,
      createHttpClient,
      createExperiments,
    },
    localeDistPath: "assets/locales",
  });

  const _createControllers = createControllersWithDescriptors({
    initI18n,
    blocksControllerService,
    createHttpClient,
    createExperiments,
    velocycleMobx,
  }, [{ method: controller0,
          wrap: wrapController0,
          exports: controllerExport0,
          widgetType: "PLATFORM_WIDGET",
          translationsConfig,
          multilingualDisabled,
          experimentsConfig: {"scopes":["members-area"],"centralized":true},
          fedopsConfig: fedopsConfig,
          sentryConfig: sentryConfig,
          persistentAcrossPages: false,
          biLogger: biLogger,
          shouldUseEssentials: true,
          withErrorBoundary: false,
          biConfig: null,
          controllerFileName: "/home/builduser/work/d58756a41851642f/packages/members-viewer-app/src/components/members/controller.ts",
          appName: "Members Area Viewer Script",
          appDefinitionId: "14cc59bc-f0b7-15b8-e1c7-89ce41d0e0c9",
          projectName: "santa-members-viewer-app",
          componentName: "members",
          localeDistPath: "assets/locales",
          defaultTranslations: defaultTranslations,
          id: "members" }, { method: controller1,
          wrap: wrapController1,
          exports: controllerExport1,
          widgetType: "PLATFORM_WIDGET",
          translationsConfig,
          multilingualDisabled,
          experimentsConfig: {"scopes":["members-area"],"centralized":true},
          fedopsConfig: fedopsConfig,
          sentryConfig: sentryConfig,
          persistentAcrossPages: false,
          biLogger: biLogger,
          shouldUseEssentials: true,
          withErrorBoundary: false,
          biConfig: null,
          controllerFileName: "/home/builduser/work/d58756a41851642f/packages/members-viewer-app/src/components/members-login-bar/controller.ts",
          appName: "Members Area Viewer Script",
          appDefinitionId: "14cc59bc-f0b7-15b8-e1c7-89ce41d0e0c9",
          projectName: "santa-members-viewer-app",
          componentName: "members-login-bar",
          localeDistPath: "assets/locales",
          defaultTranslations: defaultTranslations,
          id: "members-login-bar" }, { method: controller2,
          wrap: wrapController2,
          exports: controllerExport2,
          widgetType: "PLATFORM_WIDGET",
          translationsConfig,
          multilingualDisabled,
          experimentsConfig: {"scopes":["members-area"],"centralized":true},
          fedopsConfig: fedopsConfig,
          sentryConfig: sentryConfig,
          persistentAcrossPages: false,
          biLogger: biLogger,
          shouldUseEssentials: true,
          withErrorBoundary: false,
          biConfig: null,
          controllerFileName: "/home/builduser/work/d58756a41851642f/packages/members-viewer-app/src/components/members-menu/controller.ts",
          appName: "Members Area Viewer Script",
          appDefinitionId: "14cc59bc-f0b7-15b8-e1c7-89ce41d0e0c9",
          projectName: "santa-members-viewer-app",
          componentName: "members-menu",
          localeDistPath: "assets/locales",
          defaultTranslations: defaultTranslations,
          id: "members-menu" }],
    true);

    export const createControllers = _createControllers
