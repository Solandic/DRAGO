"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTerminalInView = exports.getTerminalInView = void 0;
const jotai_1 = require("jotai");
const terminalInViewAtom = (0, jotai_1.atom)(false);
const getTerminalInView = () => {
    var _a;
    const store = (_a = window.Jupiter) === null || _a === void 0 ? void 0 : _a.store;
    if (!store) {
        console.warn('Jupiter store is not available.');
        return false;
    }
    return store.get(terminalInViewAtom);
};
exports.getTerminalInView = getTerminalInView;
const setTerminalInView = (value) => {
    var _a;
    const store = (_a = window.Jupiter) === null || _a === void 0 ? void 0 : _a.store;
    if (!store) {
        console.warn('Jupiter store is not available.');
        return;
    }
    store.set(terminalInViewAtom, value);
};
exports.setTerminalInView = setTerminalInView;
