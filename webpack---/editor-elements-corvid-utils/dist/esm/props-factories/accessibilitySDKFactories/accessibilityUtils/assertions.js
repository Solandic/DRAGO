export const isTextElement = (sdkInstance) => isElement(sdkInstance) &&
    (sdkInstance.type === '$w.Text' || sdkInstance.type === '$w.CollapsibleText');
export const isElement = (sdkInstance) => Boolean(sdkInstance.id && sdkInstance.uniqueId && sdkInstance.type);
//# sourceMappingURL=assertions.js.map