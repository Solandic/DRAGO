import { isExperimentOpen } from '@wix/editor-elements-common-utils';
export const withCompInfo = () => (depsArray, resolver, enhancers = []) => {
    const deps = depsArray.reduce((acc, key) => ({ ...acc, [key]: true }), {});
    return {
        deps,
        resolver: enhancers.length
            ? (rawCompInfo, carmiData) => {
                const enhancedCompInfo = enhancers.reduce((compInfo, enhancer) => enhancer(compInfo), rawCompInfo);
                return resolver(enhancedCompInfo, carmiData);
            }
            : resolver,
    };
};
export const isStylableComponent = (styleProperties) => {
    // in Editor || in TB
    return Boolean(styleProperties['$st-css'] || styleProperties['st-css']);
};
export const createUDPUiTypeMapper = (stylableSkinName, udpSkinName) => withCompInfo()(['styleProperties', 'experiments'], ({ styleProperties, experiments }) => {
    const BUILDER_SPEC = 'specs.thunderbolt.renderPlatformBuilderComponent';
    const isBuilderEnv = isExperimentOpen(experiments, BUILDER_SPEC);
    if (!isStylableComponent(styleProperties) || isBuilderEnv) {
        return udpSkinName;
    }
    return stylableSkinName;
});
export const withUiTypeCompInfo = withCompInfo;
export const withStateRefs = () => (depsArray, resolver) => {
    const refApiKey = 'refApi';
    const deps = [...depsArray, refApiKey];
    const withCompInfoFunc = withCompInfo();
    return withCompInfoFunc(deps, resolver);
};
const getStateRefGetters = (stateRefsKeys, refApi) => {
    const stateRefsGetters = Object.values(refApi).reduce((acc, featureDomain) => ({
        ...acc,
        ...featureDomain,
    }), {});
    return stateRefsKeys.reduce((acc, key) => {
        if (!stateRefsGetters[key]) {
            return acc;
        }
        return {
            ...acc,
            [key]: stateRefsGetters[key](),
        };
    }, {});
};
export const withStateRefsValues = (stateRefsKeys) => {
    return withCompInfo()(['refApi'], ({ refApi }) => {
        return getStateRefGetters(stateRefsKeys, refApi);
    });
};
export function createComponentMapperModel(mapper) {
    return mapper;
}
const isCSSVariable = (str) => str.startsWith('--');
const camelCaseToDashCase = (str) => str.replace(/([A-Z])/g, val => `-${val.toLowerCase()}`);
const patchControllerUtils = (controllerUtils) => {
    /**
     * From this: { marginTop: 10 }
     * to this { margin-top: 10 }
     */
    const patchedUpdateStyles = (reactStyles) => {
        const styles = Object.entries(reactStyles).reduce((acc, [key, value]) => ({
            ...acc,
            [isCSSVariable(key) ? key : camelCaseToDashCase(key)]: value === undefined ? null : value,
        }), {});
        controllerUtils.updateStyles(styles);
    };
    return {
        ...controllerUtils,
        updateStyles: patchedUpdateStyles,
    };
};
export const withCompController = (componentPropsCreator) => {
    return {
        useComponentProps: (mapperProps, stateValues, controllerUtils) => {
            const patchedUtils = patchControllerUtils(controllerUtils);
            return componentPropsCreator({
                mapperProps,
                stateValues,
                controllerUtils: patchedUtils,
            });
        },
    };
};
//# sourceMappingURL=createComponentMapper.js.map