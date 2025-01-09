"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocaleNamespace = exports.MULTILINGUAL_NAMESPACE = void 0;
exports.MULTILINGUAL_NAMESPACE = 'multilingual';
function getLocaleNamespace(locale) {
    return "".concat(exports.MULTILINGUAL_NAMESPACE, "_").concat(locale);
}
exports.getLocaleNamespace = getLocaleNamespace;
