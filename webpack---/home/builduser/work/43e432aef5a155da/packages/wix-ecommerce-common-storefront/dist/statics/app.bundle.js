/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "https://static.parastorage.com/services/wix-ecommerce-common-storefront/e74111a02294e7ba61263839d337b2532c551c6bd95a6f5ffc6d7d15/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!******************************************!*\
  !*** ../node_modules/tslib/tslib.es6.js ***!
  \******************************************/
/*! exports provided: __extends, __assign, __rest, __decorate, __param, __esDecorate, __runInitializers, __propKey, __setFunctionName, __metadata, __awaiter, __generator, __createBinding, __exportStar, __values, __read, __spread, __spreadArrays, __spreadArray, __await, __asyncGenerator, __asyncDelegator, __asyncValues, __makeTemplateObject, __importStar, __importDefault, __classPrivateFieldGet, __classPrivateFieldSet, __classPrivateFieldIn, __addDisposableResource, __disposeResources, default */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is referenced from these modules with unsupported syntax: ../node_modules/@wix/wixstores-client-core/dist/src/common/cart-services/cart-services.js (referenced with cjs require) */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__extends", function() { return __extends; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__assign", function() { return __assign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__rest", function() { return __rest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__decorate", function() { return __decorate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__param", function() { return __param; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__esDecorate", function() { return __esDecorate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__runInitializers", function() { return __runInitializers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__propKey", function() { return __propKey; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__setFunctionName", function() { return __setFunctionName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__metadata", function() { return __metadata; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__awaiter", function() { return __awaiter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__generator", function() { return __generator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__createBinding", function() { return __createBinding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__exportStar", function() { return __exportStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__values", function() { return __values; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__read", function() { return __read; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spread", function() { return __spread; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spreadArrays", function() { return __spreadArrays; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spreadArray", function() { return __spreadArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__await", function() { return __await; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncGenerator", function() { return __asyncGenerator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncDelegator", function() { return __asyncDelegator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncValues", function() { return __asyncValues; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__makeTemplateObject", function() { return __makeTemplateObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importStar", function() { return __importStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importDefault", function() { return __importDefault; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__classPrivateFieldGet", function() { return __classPrivateFieldGet; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__classPrivateFieldSet", function() { return __classPrivateFieldSet; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__classPrivateFieldIn", function() { return __classPrivateFieldIn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__addDisposableResource", function() { return __addDisposableResource; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__disposeResources", function() { return __disposeResources; });
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};

function __runInitializers(thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};

function __propKey(x) {
    return typeof x === "symbol" ? x : "".concat(x);
};

function __setFunctionName(f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});

function __exportStar(m, o) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

/** @deprecated */
function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

/** @deprecated */
function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

var __setModuleDefault = Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

function __classPrivateFieldIn(state, receiver) {
    if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
    return typeof state === "function" ? receiver === state : state.has(receiver);
}

function __addDisposableResource(env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async) inner = dispose;
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;

}

var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function __disposeResources(env) {
    function fail(e) {
        env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
        env.hasError = true;
    }
    var r, s = 0;
    function next() {
        while (r = env.stack.pop()) {
            try {
                if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
                if (r.dispose) {
                    var result = r.dispose.call(r.value);
                    if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                }
                else s |= 1;
            }
            catch (e) {
                fail(e);
            }
        }
        if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
        if (env.hasError) throw env.error;
    }
    return next();
}

/* harmony default export */ __webpack_exports__["default"] = ({
    __extends: __extends,
    __assign: __assign,
    __rest: __rest,
    __decorate: __decorate,
    __param: __param,
    __metadata: __metadata,
    __awaiter: __awaiter,
    __generator: __generator,
    __createBinding: __createBinding,
    __exportStar: __exportStar,
    __values: __values,
    __read: __read,
    __spread: __spread,
    __spreadArrays: __spreadArrays,
    __spreadArray: __spreadArray,
    __await: __await,
    __asyncGenerator: __asyncGenerator,
    __asyncDelegator: __asyncDelegator,
    __asyncValues: __asyncValues,
    __makeTemplateObject: __makeTemplateObject,
    __importStar: __importStar,
    __importDefault: __importDefault,
    __classPrivateFieldGet: __classPrivateFieldGet,
    __classPrivateFieldSet: __classPrivateFieldSet,
    __classPrivateFieldIn: __classPrivateFieldIn,
    __addDisposableResource: __addDisposableResource,
    __disposeResources: __disposeResources,
});


/***/ }),
/* 1 */
/*!**************************!*\
  !*** external "angular" ***!
  \**************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = angular;

/***/ }),
/* 2 */
/*!*******************************!*\
  !*** ./directives/focusOn.ts ***!
  \*******************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

focus.$inject = ["$rootScope", "$timeout"];
Object.defineProperty(exports, "__esModule", { value: true });
exports.focus = exports.focusOn = void 0;
function focusOn() {
    return function (scope, elem, attr) {
        scope.$on('focusOn', function (_e, name) {
            if (name === attr.focusOn) {
                elem[0].focus();
            }
        });
    };
}
exports.focusOn = focusOn;
/* @ngInject */
function focus($rootScope, $timeout) {
    return function (name) {
        $timeout(function () {
            $rootScope.$broadcast('focusOn', name);
        });
    };
}
exports.focus = focus;


/***/ }),
/* 3 */
/*!***************************************************!*\
  !*** ./directives/visualFocusOn/visualFocusOn.ts ***!
  \***************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

visualFocusOn.$inject = ["sdkAdapter"];
Object.defineProperty(exports, "__esModule", { value: true });
exports.visualFocusOn = void 0;
var classNames = 'visual-focus-on';
/* @ngInject */
function visualFocusOn(sdkAdapter) {
    return {
        restrict: 'A',
        compile: function (element) {
            if (sdkAdapter.getDeviceType() === 'mobile') {
                return undefined;
            }
            sdkAdapter.isVisualFocusEnabled().then(function (isEnabled) {
                if (isEnabled) {
                    element.addClass(classNames);
                }
            });
            return undefined; // todo(boris): migrate from tsd to @types/
        },
    };
}
exports.visualFocusOn = visualFocusOn;


/***/ }),
/* 4 */
/*!*******************************************************!*\
  !*** ../node_modules/ng-debounce/dist/ng-debounce.js ***!
  \*******************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
angular.module("debounce",[]).service("debounce",["$timeout",function(e){return function(n,u,r){function i(){a=this,c=arguments;var i=function(){t=null,r||(o=n.apply(a,c))},l=r&&!t;return t&&e.cancel(t),t=e(i,u),l&&(o=n.apply(a,c)),o}var t,c,a,o;return i.cancel=function(){e.cancel(t),t=null},i}}]).directive("debounce",["debounce","$parse",function(e,n){return{require:"ngModel",priority:999,link:function(u,r,i,t){var c,a,o=n(i.debounce)(u),l=!!n(i.immediate)(u),d=t.$render.bind(t),s=e(function(e){a=!0,t.$setViewValue(e),a=!1},parseInt(o,10),l);t.$render=function(){d(),s.cancel(),c=this.$viewValue},t.$parsers.unshift(function(e){return a?(c=e,e):(s(t.$viewValue),c)})}}}]);

/***/ }),
/* 5 */
/*!*******************************!*\
  !*** ./services/sdkEvents.ts ***!
  \*******************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SdkEvents = void 0;
var siteEvent_1 = __webpack_require__(/*! ../enums/siteEvent */ 22);
var SdkEvents = /** @class */ (function () {
    /* @ngInject */
    SdkEvents.$inject = ["$rootScope", "Wix"];
    function SdkEvents($rootScope, Wix) {
        this.$rootScope = $rootScope;
        this.Wix = Wix;
    }
    SdkEvents.prototype.on = function (name, callback) {
        var _this = this;
        return this.Wix.PubSub.subscribe(name, function (res) {
            _this.$rootScope.$apply(function () {
                callback.call(_this, res.data);
            });
        }, false);
    };
    SdkEvents.prototype.onWithPastEvents = function (name, callback) {
        var _this = this;
        return this.Wix.PubSub.subscribe(name, function (res) {
            _this.$rootScope.$apply(function () {
                callback(res.data);
            });
        }, true);
    };
    SdkEvents.prototype.off = function (name, eventId) {
        this.Wix.PubSub.unsubscribe(name, eventId);
    };
    SdkEvents.prototype.broadcast = function (name, data) {
        if (data === void 0) { data = null; }
        this.Wix.PubSub.publish(name, data, false);
    };
    SdkEvents.prototype.broadcastPersistent = function (name, data) {
        if (data === void 0) { data = null; }
        this.Wix.PubSub.publish(name, data, true);
    };
    SdkEvents.prototype.onSiteEvent = function (eventType, callback) {
        var _this = this;
        // Prepare callback function
        var callBackFunc = function (eventData) {
            _this.$rootScope.$apply(function () {
                callback.call(_this, eventData);
            });
        };
        return this.Wix.addEventListener(this.getWixEvent(eventType), callBackFunc);
    };
    SdkEvents.prototype.offSiteEvent = function (eventType, eventId) {
        this.Wix.removeEventListener(this.getWixEvent(eventType), eventId);
    };
    SdkEvents.prototype.getWixEvent = function (eventType) {
        var res;
        switch (eventType) {
            case siteEvent_1.siteEventTypeEnum.EDIT_MODE_CHANGE:
                res = this.Wix.Events.EDIT_MODE_CHANGE;
                break;
            case siteEvent_1.siteEventTypeEnum.PAGE_NAVIGATION:
                res = this.Wix.Events.PAGE_NAVIGATION;
                break;
            case siteEvent_1.siteEventTypeEnum.PUBLIC_DATA_CHANGED:
                res = this.Wix.Events.PUBLIC_DATA_CHANGED;
                break;
            case siteEvent_1.siteEventTypeEnum.COMPONENT_DELETED:
                res = this.Wix.Events.COMPONENT_DELETED;
                break;
            case siteEvent_1.siteEventTypeEnum.STYLE_PARAMS_CHANGE:
                res = this.Wix.Events.STYLE_PARAMS_CHANGE;
                break;
            case siteEvent_1.siteEventTypeEnum.SITE_SCROLL:
                res = this.Wix.Events.SCROLL;
                break;
            case siteEvent_1.siteEventTypeEnum.SETTINGS_UPDATED:
                res = this.Wix.Events.SETTINGS_UPDATED;
                break;
            case siteEvent_1.siteEventTypeEnum.PAGE_NAVIGATION_IN:
                res = this.Wix.Events.PAGE_NAVIGATION_IN;
                break;
            default:
        }
        return res;
    };
    return SdkEvents;
}());
exports.SdkEvents = SdkEvents;


/***/ }),
/* 6 */
/*!*********************************!*\
  !*** ./services/sdkSettings.ts ***!
  \*********************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SdkSettings = void 0;
var SdkSettings = /** @class */ (function () {
    /* @ngInject */
    SdkSettings.$inject = ["Wix", "$q"];
    function SdkSettings(Wix, $q) {
        this.Wix = Wix;
        this.$q = $q;
    }
    SdkSettings.prototype.isStandaloneMode = function () {
        return this.Wix.Utils.getViewMode() === 'standalone';
    };
    SdkSettings.prototype.isFullWidth = function () {
        var defer = this.$q.defer();
        if (this.isStandaloneMode()) {
            defer.resolve(false);
        }
        else {
            this.Wix.Settings.isFullWidth(function (res) {
                defer.resolve(res);
            });
        }
        return defer.promise;
    };
    SdkSettings.prototype.getSavedSettings = function (cb) {
        if (this.isStandaloneMode()) {
            var emptySettings = {
                numbers: {},
                booleans: {},
                colors: {},
                fonts: {},
                googleFontsCssUrl: '',
            };
            cb(emptySettings);
        }
        else {
            this.Wix.Styles.getStyleParams(function (res) { return cb(res); });
        }
    };
    SdkSettings.prototype.getStringParam = function (settings, paramName, defaultValue) {
        var fonts = settings.fonts;
        return fonts && fonts.hasOwnProperty(paramName) ? fonts[paramName].value : defaultValue;
    };
    SdkSettings.prototype.getUnitParam = function (settings, paramName, defaultValue) {
        var fonts = settings.fonts;
        return fonts && fonts.hasOwnProperty(paramName) ? +/\d+(\.\d+)?/.exec(fonts[paramName].value)[0] : defaultValue;
    };
    SdkSettings.prototype.getBooleanParam = function (settings, paramName, defaultValue) {
        var booleans = settings.booleans;
        return booleans && booleans.hasOwnProperty(paramName) ? booleans[paramName] : defaultValue;
    };
    SdkSettings.prototype.getNumberParam = function (settings, paramName, defaultValue) {
        var numbers = settings.numbers;
        return numbers && numbers.hasOwnProperty(paramName) ? numbers[paramName] : defaultValue;
    };
    SdkSettings.prototype.getFontParam = function (settings, paramName, defaultValue) {
        var res = defaultValue;
        var fonts = settings.fonts;
        if (fonts && fonts.hasOwnProperty(paramName)) {
            res = fonts[paramName];
            if (typeof res === 'object' && typeof res.preset !== 'string') {
                res.preset = 'Custom';
            } // font style always needs font style.
        }
        return res;
    };
    SdkSettings.prototype.getFontFromPreset = function (presetName) {
        var presets = this.Wix.Styles.getSiteTextPresets();
        var preset = presets[presetName];
        return {
            size: parseInt(preset.size, 10),
            family: preset.fontFamily,
            preset: presetName,
            style: {
                bold: preset.weight === 'bold',
                italic: preset.style === 'italic',
                underline: false,
            },
        };
    };
    // convert {themeName: "color-12", value: '#SSS' to color object
    SdkSettings.prototype.getColorParam = function (settings, paramName, defaultValue, withOpacity, defaultOpacity) {
        var object;
        if (settings.colors &&
            settings.colors.hasOwnProperty(paramName) &&
            Object.keys(settings.colors[paramName]).length > 0) {
            object = this.getColorObject(settings.colors[paramName], withOpacity);
        }
        else {
            object = this.getColorFromTheme(defaultValue, withOpacity, defaultOpacity);
        }
        return object;
    };
    SdkSettings.prototype.getColorFromTheme = function (defaultValue, withOpacity, defaultOpacity) {
        var object = this.getColorObject({ defaultValue: defaultValue }, withOpacity);
        if (withOpacity && typeof defaultOpacity === 'number') {
            object.opacity = defaultOpacity;
            var parts = object.rgba.split(',');
            parts[3] = "".concat(object.opacity, ")");
            object.rgba = parts.join(',');
        }
        return object;
    };
    SdkSettings.prototype.getColorObject = function (colorEntry, withOpacity) {
        var res = {};
        // get color object if exists
        res.color = false;
        if (this.isHex(colorEntry)) {
            res.color = { value: colorEntry.defaultValue };
        }
        else if (colorEntry.defaultValue) {
            var siteColors = this.Wix.Styles.getSiteColors();
            res.color = siteColors
                ? siteColors.filter(function (color) { return color.reference === colorEntry.defaultValue; })[0]
                : { value: '#FFFFFF' };
        }
        if (withOpacity) {
            res.rgba = colorEntry && colorEntry.value ? colorEntry.value : res.color.value;
            // convert to rgba
            if (res.rgba.indexOf('#') === 0) {
                res.rgba = this.hexToRgba(res.rgba);
            }
            var split = res.rgba.split(',');
            if (split.length > 3) {
                res.opacity = +split[3].replace(')', '');
            }
            else {
                res.opacity = res.rgba === 'transparent' ? 0 : 1;
                res.rgba = "rgba(0,0,0,".concat(res.opacity, ")");
                res.cssColor = res.rgba;
            }
        }
        else {
            res.cssColor = colorEntry && colorEntry.value ? colorEntry.value : res.color.value;
        }
        return res;
    };
    SdkSettings.prototype.isHex = function (colorEntry) {
        return colorEntry.defaultValue && colorEntry.defaultValue.indexOf('#') === 0;
    };
    SdkSettings.prototype.hexToRgba = function (hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);
        var opacity = parseInt(result[4], 16);
        opacity = isNaN(opacity) ? 1 : opacity / 255;
        //tslint:disable-next-line
        return ('rgba(' +
            parseInt(result[1], 16) +
            ',' +
            parseInt(result[2], 16) +
            ',' +
            parseInt(result[3], 16) +
            ',' +
            "".concat(opacity, ")"));
    };
    return SdkSettings;
}());
exports.SdkSettings = SdkSettings;


/***/ }),
/* 7 */
/*!*************************************************************************!*\
  !*** ../node_modules/@wix/wixstores-client-core/dist/src/types/cart.js ***!
  \*************************************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CartEvents = exports.CartType = void 0;
var CartType;
(function (CartType) {
    CartType["DIGITAL"] = "digital";
    CartType["PHYSICAL"] = "physical";
    CartType["MIXED"] = "mixed";
    CartType["MIXED_VERTICALS"] = "mixed_verticals";
    CartType["SERVICE"] = "service";
    CartType["GIFT_CARD"] = "gift_card";
    CartType["UNRECOGNISED"] = "unrecognised";
})(CartType = exports.CartType || (exports.CartType = {}));
var CartEvents;
(function (CartEvents) {
    CartEvents["CHANGED"] = "Cart.Changed";
    CartEvents["CLEARED"] = "Cart.Cleared";
})(CartEvents = exports.CartEvents || (exports.CartEvents = {}));
//# sourceMappingURL=cart.js.map

/***/ }),
/* 8 */
/*!**************************************!*\
  !*** ./services/appClientService.ts ***!
  \**************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

appClientService.$inject = ["topology"];
Object.defineProperty(exports, "__esModule", { value: true });
exports.appClientService = void 0;
var app_settings_client_1 = __webpack_require__(/*! @wix/app-settings-client */ 44);
/* @ngInject */
function appClientService(topology) {
    return (0, app_settings_client_1.appClient)({ scope: app_settings_client_1.Scope.COMPONENT, cdnUrl: topology.appSettingsCDNClientBaseUrl });
}
exports.appClientService = appClientService;


/***/ }),
/* 9 */
/*!*************************************!*\
  !*** ./services/settingsManager.ts ***!
  \*************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

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
var getLocaleNamespace_1 = __webpack_require__(/*! ../multilingual/getLocaleNamespace */ 43);
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


/***/ }),
/* 10 */
/*!*********************************!*\
  !*** ./services/cartStorage.ts ***!
  \*********************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CartStorage = void 0;
var angular = __webpack_require__(/*! angular */ 1);
var CartStorage = /** @class */ (function () {
    /* @ngInject */
    CartStorage.$inject = ["sdkEvents"];
    function CartStorage(sdkEvents) {
        this.sdkEvents = sdkEvents;
        this.cartData = { items: [], itemsTypes: [] };
    }
    CartStorage.prototype.saveCartDataLocally = function (newCart) {
        angular.copy(newCart, this.cartData);
    };
    CartStorage.prototype.saveCart = function (cart, origin, shouldOpenCart) {
        if (shouldOpenCart === void 0) { shouldOpenCart = true; }
        cart.extraParams = { origin: origin };
        cart.eventOptions = { shouldOpenCart: shouldOpenCart };
        delete cart.billingAddress;
        delete cart.shippingAddress;
        this.sdkEvents.broadcast('Cart.Changed', cart);
    };
    CartStorage.prototype.getCartId = function () {
        return this.cartData.cartId;
    };
    CartStorage.prototype.removeCart = function (cartId) {
        this.sdkEvents.broadcast('Cart.Cleared', { cartId: cartId });
    };
    return CartStorage;
}());
exports.CartStorage = CartStorage;


/***/ }),
/* 11 */
/*!*********************************************!*\
  !*** ../node_modules/query-string/index.js ***!
  \*********************************************/
/*! no static exports found */
/*! exports used: parse */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strictUriEncode = __webpack_require__(/*! strict-uri-encode */ 35);
var objectAssign = __webpack_require__(/*! object-assign */ 36);
var decodeComponent = __webpack_require__(/*! decode-uri-component */ 37);

function encoderForArrayFormat(opts) {
	switch (opts.arrayFormat) {
		case 'index':
			return function (key, value, index) {
				return value === null ? [
					encode(key, opts),
					'[',
					index,
					']'
				].join('') : [
					encode(key, opts),
					'[',
					encode(index, opts),
					']=',
					encode(value, opts)
				].join('');
			};

		case 'bracket':
			return function (key, value) {
				return value === null ? encode(key, opts) : [
					encode(key, opts),
					'[]=',
					encode(value, opts)
				].join('');
			};

		default:
			return function (key, value) {
				return value === null ? encode(key, opts) : [
					encode(key, opts),
					'=',
					encode(value, opts)
				].join('');
			};
	}
}

function parserForArrayFormat(opts) {
	var result;

	switch (opts.arrayFormat) {
		case 'index':
			return function (key, value, accumulator) {
				result = /\[(\d*)\]$/.exec(key);

				key = key.replace(/\[\d*\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = {};
				}

				accumulator[key][result[1]] = value;
			};

		case 'bracket':
			return function (key, value, accumulator) {
				result = /(\[\])$/.exec(key);
				key = key.replace(/\[\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				} else if (accumulator[key] === undefined) {
					accumulator[key] = [value];
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};

		default:
			return function (key, value, accumulator) {
				if (accumulator[key] === undefined) {
					accumulator[key] = value;
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};
	}
}

function encode(value, opts) {
	if (opts.encode) {
		return opts.strict ? strictUriEncode(value) : encodeURIComponent(value);
	}

	return value;
}

function keysSorter(input) {
	if (Array.isArray(input)) {
		return input.sort();
	} else if (typeof input === 'object') {
		return keysSorter(Object.keys(input)).sort(function (a, b) {
			return Number(a) - Number(b);
		}).map(function (key) {
			return input[key];
		});
	}

	return input;
}

function extract(str) {
	var queryStart = str.indexOf('?');
	if (queryStart === -1) {
		return '';
	}
	return str.slice(queryStart + 1);
}

function parse(str, opts) {
	opts = objectAssign({arrayFormat: 'none'}, opts);

	var formatter = parserForArrayFormat(opts);

	// Create an object with no prototype
	// https://github.com/sindresorhus/query-string/issues/47
	var ret = Object.create(null);

	if (typeof str !== 'string') {
		return ret;
	}

	str = str.trim().replace(/^[?#&]/, '');

	if (!str) {
		return ret;
	}

	str.split('&').forEach(function (param) {
		var parts = param.replace(/\+/g, ' ').split('=');
		// Firefox (pre 40) decodes `%3D` to `=`
		// https://github.com/sindresorhus/query-string/pull/37
		var key = parts.shift();
		var val = parts.length > 0 ? parts.join('=') : undefined;

		// missing `=` should be `null`:
		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
		val = val === undefined ? null : decodeComponent(val);

		formatter(decodeComponent(key), val, ret);
	});

	return Object.keys(ret).sort().reduce(function (result, key) {
		var val = ret[key];
		if (Boolean(val) && typeof val === 'object' && !Array.isArray(val)) {
			// Sort object keys, not values
			result[key] = keysSorter(val);
		} else {
			result[key] = val;
		}

		return result;
	}, Object.create(null));
}

exports.extract = extract;
exports.parse = parse;

exports.stringify = function (obj, opts) {
	var defaults = {
		encode: true,
		strict: true,
		arrayFormat: 'none'
	};

	opts = objectAssign(defaults, opts);

	if (opts.sort === false) {
		opts.sort = function () {};
	}

	var formatter = encoderForArrayFormat(opts);

	return obj ? Object.keys(obj).sort(opts.sort).map(function (key) {
		var val = obj[key];

		if (val === undefined) {
			return '';
		}

		if (val === null) {
			return encode(key, opts);
		}

		if (Array.isArray(val)) {
			var result = [];

			val.slice().forEach(function (val2) {
				if (val2 === undefined) {
					return;
				}

				result.push(formatter(key, val2, result.length));
			});

			return result.join('&');
		}

		return encode(key, opts) + '=' + encode(val, opts);
	}).filter(function (x) {
		return x.length > 0;
	}).join('&') : '';
};

exports.parseUrl = function (str, opts) {
	return {
		url: str.split('?')[0] || '',
		query: parse(extract(str), opts)
	};
};


/***/ }),
/* 12 */
/*!**********************************!*\
  !*** ../node_modules/uuid/v4.js ***!
  \**********************************/
/*! no static exports found */
/*! exports used: default */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(/*! ./lib/rng */ 38);
var bytesToUuid = __webpack_require__(/*! ./lib/bytesToUuid */ 39);

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;


/***/ }),
/* 13 */
/*!******************************************************************************!*\
  !*** ../node_modules/@wix/js-sdk-wrapper/dist/src/create-wix-sdk-wrapper.js ***!
  \******************************************************************************/
/*! no static exports found */
/*! exports used: wixSdk */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.wixSdk = void 0;
var tslib_1 = __webpack_require__(/*! tslib */ 41);
var utils_1 = __webpack_require__(/*! ./utils */ 42);
function wixSdk(Wix) {
    var errorLogger = function (ex) {
        if (global.console && typeof global.console.error === 'function') {
            console.error(ex); //tslint:disable-line:no-console
        }
    };
    if (!Wix) {
        errorLogger(new Error('Wix Sdk is missing'));
        return null;
    }
    var safeCall = utils_1.createSafeCall(function (ex) {
        errorLogger(ex);
    });
    var WixSdkWrapper = {
        valid: false,
        config: {
            setErrorLogger: function (handler) {
                errorLogger = handler;
            },
        },
        Activities: {
            Type: Wix.Activities.Type,
            Error: Wix.Activities.Error,
            postActivity: function (activity) {
                return utils_1.addTimeout(new Promise(function (resolve, reject) {
                    Wix.Activities.postActivity(activity, resolve, reject);
                }));
            },
            getActivities: function (query) {
                return utils_1.addTimeout(new Promise(function (resolve, reject) {
                    Wix.Activities.getActivities(resolve, reject, query);
                }));
            },
            getActivityById: function (id) {
                return utils_1.addTimeout(new Promise(function (resolve, reject) {
                    Wix.Activities.getActivityById(id, resolve, reject);
                }));
            },
            getUserSessionToken: function () {
                return utils_1.addTimeout(new Promise(function (resolve) {
                    Wix.Activities.getUserSessionToken(resolve);
                }));
            },
        },
        Analytics: {
            PixelType: Wix.Analytics.PixelType,
            PixelEventType: Wix.Analytics.PixelEventType,
            registerCampaignPixel: Wix.Analytics.registerCampaignPixel,
            reportCampaignEvent: Wix.Analytics.reportCampaignEvent,
        },
        Billing: {
            Cycle: Wix.Billing.Cycle,
            openBillingPageForProduct: function (vendorProductId, cycle) {
                return utils_1.addTimeout(new Promise(function (resolve, reject) {
                    Wix.Billing.openBillingPageForProduct(vendorProductId, cycle, reject);
                }));
            },
            getBillingPageForProduct: function (vendorProductId, cycle) {
                return utils_1.addTimeout(new Promise(function (resolve, reject) {
                    Wix.Billing.getBillingPageForProduct(vendorProductId, cycle, resolve, reject);
                }));
            },
            getBillingPackages: function (vendorProductIds) {
                return utils_1.addTimeout(new Promise(function (resolve, reject) {
                    Wix.Billing.getBillingPackages(vendorProductIds, resolve, reject);
                }));
            },
            getProducts: function (options) {
                return utils_1.addTimeout(new Promise(function (resolve, reject) {
                    Wix.Billing.getProducts(options, resolve, reject);
                }));
            },
        },
        Contacts: {
            getContacts: function (options) {
                return utils_1.addTimeout(new Promise(function (resolve, reject) {
                    Wix.Contacts.getContacts(options, resolve, reject);
                }));
            },
            getContactById: function (id) {
                return utils_1.addTimeout(new Promise(function (resolve, reject) {
                    Wix.Contacts.getContactById(id, resolve, reject);
                }));
            },
            reconcileContact: function (contactInfo) {
                return utils_1.addTimeout(new Promise(function (resolve, reject) {
                    Wix.Contacts.reconcileContact(contactInfo, resolve, reject);
                }));
            },
        },
        Dashboard: {
            PremiumIntent: Wix.Dashboard.PremiumIntent,
            setHeight: Wix.Dashboard.setHeight,
            openMediaDialog: function (mediaType, multipleSelection, onCancel) {
                return new Promise(function (resolve) {
                    Wix.Dashboard.openMediaDialog(mediaType, multipleSelection, resolve, onCancel);
                });
            },
            openBillingPage: Wix.Dashboard.openBillingPage,
            openModal: function (url, width, height) {
                return new Promise(function (resolve) {
                    Wix.Dashboard.openModal(url, width, height, resolve);
                });
            },
            closeWindow: Wix.Dashboard.closeWindow,
            scrollTo: Wix.Dashboard.scrollTo,
            getEditorUrl: function () {
                return utils_1.addTimeout(new Promise(function (resolve) {
                    Wix.Dashboard.getEditorUrl(resolve);
                }));
            },
            pushState: Wix.Dashboard.pushState,
            resizeWindow: Wix.Dashboard.resizeWindow,
            revalidateSession: function () {
                return utils_1.addTimeout(new Promise(function (resolve, reject) {
                    Wix.Dashboard.revalidateSession(resolve, reject);
                }));
            },
            getProducts: function () {
                return utils_1.addTimeout(new Promise(function (resolve, reject) {
                    Wix.Dashboard.getProducts(resolve, reject);
                }));
            },
            getSiteViewUrl: function (options) {
                return utils_1.addTimeout(new Promise(function (resolve) {
                    Wix.Dashboard.getSiteViewUrl(options, resolve);
                }));
            },
            appEngaged: Wix.Dashboard.appEngaged,
        },
        Error: Wix.Error,
        Events: Wix.Events,
        Features: {
            Types: Wix.Features.Types,
            isSupported: function (featureName) {
                return utils_1.addTimeout(new Promise(function (resolve) {
                    Wix.Features.isSupported(featureName, resolve);
                }));
            },
        },
        Media: {
            AudioType: Wix.Media.AudioType,
            getImageUrl: Wix.Media.getImageUrl,
            getResizedImageUrl: Wix.Media.getResizedImageUrl,
            getAudioUrl: Wix.Media.getAudioUrl,
            getDocumentUrl: Wix.Media.getDocumentUrl,
            getSwfUrl: Wix.Media.getSwfUrl,
            getPreviewSecureMusicUrl: Wix.Media.getPreviewSecureMusicUrl,
        },
        PubSub: {
            unsubscribe: Wix.PubSub.unsubscribe,
            subscribe: Wix.PubSub.subscribe,
            publish: Wix.PubSub.publish,
        },
        Preview: {
            openSettingsDialog: Wix.Preview.openSettingsDialog,
        },
        Settings: {
            MediaType: Wix.Settings.MediaType,
            PremiumIntent: Wix.Settings.PremiumIntent,
            getColorByreference: Wix.Settings.getColorByreference,
            setBooleanParam: Wix.Settings.setBooleanParam,
            setColorParam: Wix.Settings.setColorParam,
            setNumberParam: Wix.Settings.setNumberParam,
            getSiteColors: function () {
                return utils_1.addTimeout(new Promise(function (resolve) {
                    Wix.Settings.getSiteColors(resolve);
                }));
            },
            getStyleColorByKey: Wix.Settings.getStyleColorByKey,
            getWindowPlacement: function (compId) {
                return utils_1.addTimeout(new Promise(function (resolve) {
                    Wix.Settings.getWindowPlacement(compId, resolve);
                }));
            },
            getDashboardAppUrl: function () {
                return utils_1.addTimeout(new Promise(function (resolve) {
                    Wix.Settings.getDashboardAppUrl(resolve);
                }));
            },
            getSiteInfo: function () {
                return utils_1.addTimeout(new Promise(function (resolve) {
                    Wix.Settings.getSiteInfo(resolve);
                }));
            },
            getSitePages: function (options) {
                return utils_1.addTimeout(new Promise(function (resolve) {
                    Wix.Settings.getSitePages(options, resolve);
                }));
            },
            getSiteMap: function () {
                return utils_1.addTimeout(new Promise(function (resolve) {
                    Wix.Settings.getSiteMap(resolve);
                }));
            },
            getStyleParams: function () {
                return utils_1.addTimeout(new Promise(function (resolve) {
                    Wix.Settings.getStyleParams(resolve);
                }));
            },
            openBillingPage: Wix.Settings.openBillingPage,
            appEngaged: Wix.Settings.appEngaged,
            openMediaDialog: function (mediaType, multipleSelection, onCancel) {
                return new Promise(function (resolve) {
                    Wix.Settings.openMediaDialog(mediaType, multipleSelection, resolve, onCancel);
                });
            },
            openSiteMembersSettingsDialog: Wix.Settings.openSiteMembersSettingsDialog,
            refreshApp: Wix.Settings.refreshApp,
            refreshAppByCompIds: Wix.Settings.refreshAppByCompIds,
            setWindowPlacement: Wix.Settings.setWindowPlacement,
            triggerSettingsUpdatedEvent: Wix.Settings.triggerSettingsUpdatedEvent,
            openModal: function (url, width, height, title, bareUI) {
                return new Promise(function (resolve) {
                    Wix.Settings.openModal(url, width, height, title, resolve, bareUI);
                });
            },
            closeWindow: Wix.Settings.closeWindow,
            addComponent: function (options) {
                return utils_1.addTimeout(new Promise(function (resolve, reject) {
                    Wix.Settings.addComponent(options, resolve, reject);
                }));
            },
            resizeComponent: function (options) {
                return utils_1.addTimeout(new Promise(function (resolve, reject) {
                    Wix.Settings.resizeComponent(options, resolve, reject);
                }));
            },
            setExternalId: function (guid) {
                return utils_1.addTimeout(new Promise(function (resolve, reject) {
                    Wix.Settings.setExternalId(guid, resolve, reject);
                }));
            },
            revalidateSession: function () {
                return utils_1.addTimeout(new Promise(function (resolve, reject) {
                    Wix.Settings.revalidateSession(resolve, reject);
                }));
            },
            getCurrentPageAnchors: function () {
                return utils_1.addTimeout(new Promise(function (resolve) {
                    Wix.Settings.getCurrentPageAnchors(resolve);
                }));
            },
            setFullWidth: function (shouldBeFullWidth, options) {
                return utils_1.addTimeout(new Promise(function (resolve, reject) {
                    Wix.Settings.setFullWidth(shouldBeFullWidth, options, resolve, reject);
                }));
            },
            isFullWidth: function () {
                return utils_1.addTimeout(new Promise(function (resolve) {
                    Wix.Settings.isFullWidth(resolve);
                }));
            },
            openReviewInfo: Wix.Settings.openReviewInfo,
            getStateUrl: function (sectionId, state) {
                return utils_1.addTimeout(new Promise(function (resolve) {
                    Wix.Settings.getStateUrl(sectionId, state, resolve);
                }));
            },
            isComponentInstalled: function (componentId) {
                return utils_1.addTimeout(new Promise(function (resolve) {
                    Wix.Settings.isComponentInstalled(componentId, resolve);
                }));
            },
            openLinkPanel: function (options, onCacnel) {
                return new Promise(function (resolve) {
                    Wix.Settings.openLinkPanel(options, resolve, onCacnel);
                });
            },
        },
        Styles: {
            getStyleParams: function () {
                return utils_1.addTimeout(new Promise(function (resolve) {
                    Wix.Styles.getStyleParams(resolve);
                }));
            },
            setStyleParams: function (styleObjArr) {
                return utils_1.addTimeout(new Promise(function (resolve, reject) {
                    Wix.Styles.setStyleParams(styleObjArr, resolve, reject);
                }));
            },
            setFontParam: function (key, value) {
                return utils_1.addTimeout(new Promise(function (resolve, reject) {
                    Wix.Styles.setFontParam(key, value, resolve, reject);
                }));
            },
            getEditorFonts: function () {
                return utils_1.addTimeout(new Promise(function (resolve) {
                    Wix.Styles.getEditorFonts(resolve);
                }));
            },
            getSiteTextPresets: function () {
                return utils_1.addTimeout(new Promise(function (resolve) {
                    Wix.Styles.getSiteTextPresets(resolve);
                }));
            },
            getFontsSpriteUrl: function () {
                return utils_1.addTimeout(new Promise(function (resolve) {
                    Wix.Styles.getFontsSpriteUrl(resolve);
                }));
            },
            getStyleFontByKey: Wix.Styles.getStyleFontByKey,
            getStyleFontByReference: Wix.Styles.getStyleFontByReference,
            getSiteColors: function () {
                return utils_1.addTimeout(new Promise(function (resolve) {
                    Wix.Styles.getSiteColors(resolve);
                }));
            },
            getStyleColorByKey: Wix.Styles.getStyleColorByKey,
            getColorByreference: Wix.Styles.getColorByreference,
            setColorParam: function (key, value) {
                return utils_1.addTimeout(new Promise(function (resolve, reject) {
                    Wix.Styles.setColorParam(key, value, resolve, reject);
                }));
            },
            setNumberParam: function (key, value) {
                return utils_1.addTimeout(new Promise(function (resolve, reject) {
                    Wix.Styles.setNumberParam(key, value, resolve, reject);
                }));
            },
            setBooleanParam: function (key, value) {
                return utils_1.addTimeout(new Promise(function (resolve, reject) {
                    Wix.Styles.setBooleanParam(key, value, resolve, reject);
                }));
            },
            openColorPicker: function (params) {
                return new Promise(function (resolve) {
                    Wix.Styles.openColorPicker(params, resolve);
                });
            },
            openFontPicker: function (params) {
                return new Promise(function (resolve) {
                    Wix.Styles.openFontPicker(params, resolve);
                });
            },
            setUILIBParamValue: Wix.Styles.setUILIBParamValue,
            getStyleId: function () {
                return utils_1.addTimeout(new Promise(function (resolve) {
                    Wix.Styles.getStyleId(resolve);
                }));
            },
            getStyleParamsByStyleId: function (styleId) {
                return utils_1.addTimeout(new Promise(function (resolve, reject) {
                    Wix.Styles.getStyleParamsByStyleId(styleId, resolve, reject);
                }));
            },
        },
        Theme: Wix.Theme,
        Utils: {
            getViewMode: safeCall(Wix.Utils.getViewMode),
            toWixDate: safeCall(Wix.Utils.toWixDate),
            getCompId: safeCall(Wix.Utils.getCompId),
            getOrigCompId: safeCall(Wix.Utils.getOrigCompId),
            getWidth: safeCall(Wix.Utils.getWidth),
            getLocale: safeCall(Wix.Utils.getLocale),
            getCacheKiller: safeCall(Wix.Utils.getCacheKiller),
            getTarget: safeCall(Wix.Utils.getTarget),
            getSectionUrl: function (sectionIdentifier) {
                return utils_1.addTimeout(new Promise(function (resolve) {
                    Wix.Utils.getSectionUrl(sectionIdentifier, resolve);
                }));
            },
            getInstanceId: safeCall(Wix.Utils.getInstanceId),
            getSignDate: safeCall(Wix.Utils.getSignDate),
            getUid: safeCall(Wix.Utils.getUid),
            getPermissions: safeCall(Wix.Utils.getPermissions),
            getIpAndPort: safeCall(Wix.Utils.getIpAndPort),
            getDemoMode: safeCall(Wix.Utils.getDemoMode),
            getDeviceType: safeCall(Wix.Utils.getDeviceType),
            getInstanceValue: safeCall(Wix.Utils.getInstanceValue),
            navigateToSection: safeCall(Wix.Utils.navigateToSection),
            getSiteOwnerId: safeCall(Wix.Utils.getSiteOwnerId),
            Media: {
                AudioType: Wix.Utils.Media.AudioType,
                getImageUrl: Wix.Utils.Media.getImageUrl,
                getResizedImageUrl: Wix.Utils.Media.getResizedImageUrl,
                getAudioUrl: Wix.Utils.Media.getAudioUrl,
                getDocumentUrl: Wix.Utils.Media.getDocumentUrl,
                getSwfUrl: Wix.Utils.Media.getSwfUrl,
                getPreviewSecureMusicUrl: Wix.Utils.Media.getPreviewSecureMusicUrl,
            },
        },
        Data: {
            SCOPE: Wix.Data.SCOPE,
            Public: {
                set: function (key, value, options) {
                    return utils_1.addTimeout(new Promise(function (resolve, reject) {
                        Wix.Data.Public.set(key, value, options, resolve, reject);
                    }));
                },
                get: function (key, value, options) {
                    return utils_1.addTimeout(new Promise(function (resolve, reject) {
                        Wix.Data.Public.get(key, options, resolve, reject);
                    }));
                },
                remove: function (key, value, options) {
                    return utils_1.addTimeout(new Promise(function (resolve, reject) {
                        Wix.Data.Public.remove(key, options, resolve, reject);
                    }));
                },
            },
        },
        Performance: {
            applicationLoaded: Wix.Performance.applicationLoaded,
            applicationLoadingStep: Wix.Performance.applicationLoadingStep,
        },
        WindowOrigin: Wix.WindowOrigin,
        WindowPlacement: Wix.WindowPlacement,
        openModal: function (url, width, height, theme) {
            return new Promise(function (resolve) {
                Wix.openModal(url, width, height, resolve, theme);
            });
        },
        openPopup: function (url, width, height, position, theme) {
            return new Promise(function (resolve) {
                Wix.openPopup(url, width, height, position, resolve, theme);
            });
        },
        setHeight: Wix.setHeight,
        closeWindow: Wix.closeWindow,
        scrollTo: Wix.scrollTo,
        scrollBy: Wix.scrollBy,
        getSiteInfo: function () {
            return utils_1.addTimeout(new Promise(function (resolve) {
                Wix.getSiteInfo(resolve);
            }));
        },
        getSitePages: function (options) {
            return utils_1.addTimeout(new Promise(function (resolve) {
                Wix.getSitePages(options, resolve);
            }));
        },
        getSiteMap: function () {
            return utils_1.addTimeout(new Promise(function (resolve) {
                Wix.getSiteMap(resolve);
            }));
        },
        getBoundingRectAndOffsets: function () {
            return utils_1.addTimeout(new Promise(function (resolve) {
                Wix.getBoundingRectAndOffsets(resolve);
            }));
        },
        removeEventListener: Wix.removeEventListener,
        addEventListener: Wix.addEventListener,
        resizeWindow: Wix.resizeWindow,
        requestLogin: function (options, onCancel) {
            return new Promise(function (resolve) {
                Wix.requestLogin(options, resolve, onCancel);
            });
        },
        logOutCurrentMember: function (options) {
            return utils_1.addTimeout(new Promise(function (resolve, reject) {
                Wix.logOutCurrentMember(options, reject);
            }));
        },
        currentMember: function () {
            return utils_1.addTimeout(new Promise(function (resolve) {
                Wix.currentMember(resolve);
            }));
        },
        navigateTo: function (linkData) {
            return utils_1.addTimeout(new Promise(function (resolve, reject) {
                Wix.navigateTo(linkData, reject);
            }));
        },
        navigateToPage: function (pageId, options) {
            return utils_1.addTimeout(new Promise(function (resolve, reject) {
                Wix.navigateToPage(pageId, options, reject);
            }));
        },
        getCurrentPageId: function () {
            return utils_1.addTimeout(new Promise(function (resolve) {
                Wix.getCurrentPageId(resolve);
            }));
        },
        pushState: Wix.pushState,
        reportHeightChange: Wix.reportHeightChange,
        getStyleParams: function () {
            return utils_1.addTimeout(new Promise(function (resolve) {
                Wix.getStyleParams(resolve);
            }));
        },
        getExternalId: function () {
            return utils_1.addTimeout(new Promise(function (resolve, reject) {
                Wix.getExternalId(resolve, reject);
            }));
        },
        navigateToComponent: function (compId, options) {
            return utils_1.addTimeout(new Promise(function (resolve, reject) {
                Wix.navigateToComponent(compId, options, reject);
            }));
        },
        resizeComponent: function (options) {
            return utils_1.addTimeout(new Promise(function (resolve, reject) {
                Wix.resizeComponent(options, resolve, reject);
            }));
        },
        revalidateSession: function () {
            return utils_1.addTimeout(new Promise(function (resolve, reject) {
                Wix.revalidateSession(resolve, reject);
            }));
        },
        getCurrentPageAnchors: function () {
            return utils_1.addTimeout(new Promise(function (resolve) {
                Wix.getCurrentPageAnchors(resolve);
            }));
        },
        navigateToAnchor: function (anchorId) {
            return utils_1.addTimeout(new Promise(function (resolve, reject) {
                Wix.navigateToAnchor(anchorId, reject);
            }));
        },
        getComponentInfo: function () {
            return utils_1.addTimeout(new Promise(function (resolve) {
                Wix.getComponentInfo(resolve);
            }));
        },
        replaceSectionState: Wix.replaceSectionState,
        setPageMetadata: Wix.setPageMetadata,
        getStateUrl: function (sectionId, state) {
            return utils_1.addTimeout(new Promise(function (resolve) {
                Wix.getStateUrl(sectionId, state, resolve);
            }));
        },
        getAdsOnPage: function () {
            return utils_1.addTimeout(new Promise(function (resolve) {
                Wix.getAdsOnPage(resolve);
            }));
        },
    };
    if (!Wix.SuperApps) {
        return WixSdkWrapper;
    }
    return tslib_1.__assign(tslib_1.__assign({}, WixSdkWrapper), { SuperApps: {
            Settings: {
                MediaType: Wix.SuperApps.Settings.MediaType,
                openBillingPage: Wix.SuperApps.Settings.openBillingPage,
                getInstalledInstance: function (appDefinitionId) {
                    return utils_1.addTimeout(new Promise(function (resolve, reject) {
                        Wix.SuperApps.Settings.getInstalledInstance(appDefinitionId, resolve, reject);
                    }));
                },
                openMediaDialog: function (mediaType, multipleSelection, onCancel) {
                    return new Promise(function (resolve) {
                        Wix.SuperApps.Settings.openMediaDialog(mediaType, multipleSelection, resolve, onCancel);
                    });
                },
                openModal: function (url, width, height, title, bareUI, options) {
                    return new Promise(function (resolve) {
                        Wix.SuperApps.Settings.openModal(url, width, height, title, resolve, bareUI, options);
                    });
                },
                setHelpArticle: Wix.SuperApps.Settings.setHelpArticle,
            },
            Dashboard: {
                showHeader: Wix.SuperApps.Dashboard.showHeader,
                hideHeader: Wix.SuperApps.Dashboard.hideHeader,
                setHelpArticle: Wix.SuperApps.Dashboard.setHelpArticle,
                getProducts: function (options) {
                    return utils_1.addTimeout(new Promise(function (resolve, reject) {
                        Wix.SuperApps.Dashboard.getProducts(options, resolve, reject);
                    }));
                },
                openMediaDialog: function (mediaType, multipleSelection, onCancel) {
                    return new Promise(function (resolve) {
                        Wix.SuperApps.Dashboard.openMediaDialog(mediaType, multipleSelection, resolve, onCancel);
                    });
                },
            },
            getInstalledInstance: function (appDefinitionId) {
                return utils_1.addTimeout(new Promise(function (resolve, reject) {
                    Wix.SuperApps.getInstalledInstance(appDefinitionId, resolve, reject);
                }));
            },
            OnBoarding: {
                Settings: {
                    getStyleByCompId: function (compId) {
                        return utils_1.addTimeout(new Promise(function (resolve) {
                            Wix.SuperApps.OnBoarding.Settings.getStyleByCompId(compId, resolve);
                        }));
                    },
                },
            },
            Billing: {
                getProducts: function (options) {
                    return utils_1.addTimeout(new Promise(function (resolve, reject) {
                        Wix.SuperApps.Billing.getProducts(options, resolve, reject);
                    }));
                },
            },
            getCtToken: function () {
                return utils_1.addTimeout(new Promise(function (resolve) {
                    Wix.SuperApps.getCtToken(resolve);
                }));
            },
        }, getInstalledInstance: function (appDefinitionId) {
            return utils_1.addTimeout(new Promise(function (resolve, reject) {
                Wix.getInstalledInstance(appDefinitionId, resolve, reject);
            }));
        }, OnBoarding: {
            Settings: {
                getStyleByCompId: function (compId) {
                    return utils_1.addTimeout(new Promise(function (resolve) {
                        Wix.OnBoarding.Settings.getStyleByCompId(compId, resolve);
                    }));
                },
            },
        }, getCtToken: function () {
            return utils_1.addTimeout(new Promise(function (resolve) {
                Wix.getCtToken(resolve);
            }));
        } });
}
exports.wixSdk = wixSdk;
//# sourceMappingURL=create-wix-sdk-wrapper.js.map
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../webpack/buildin/global.js */ 40)))

/***/ }),
/* 14 */
/*!****************!*\
  !*** ./app.ts ***!
  \****************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.commonStoreFrontModule = void 0;
var angular = __webpack_require__(/*! angular */ 1);
var isTouchDevice_1 = __webpack_require__(/*! ./directives/isTouchDevice */ 15);
var postLoad_1 = __webpack_require__(/*! ./directives/postLoad */ 16);
var sectionLink_1 = __webpack_require__(/*! ./directives/sectionLink */ 17);
var focusOn_1 = __webpack_require__(/*! ./directives/focusOn */ 2);
var settingsApi_1 = __webpack_require__(/*! ./services/settingsApi/settingsApi */ 18);
var visualFocusOn_1 = __webpack_require__(/*! ./directives/visualFocusOn/visualFocusOn */ 3);
__webpack_require__(/*! ng-debounce/dist/ng-debounce.js */ 4);
var commonBiLogger_1 = __webpack_require__(/*! ./services/commonBiLogger */ 21);
var sdkEvents_1 = __webpack_require__(/*! ./services/sdkEvents */ 5);
var sdkSettings_1 = __webpack_require__(/*! ./services/sdkSettings */ 6);
var cartApi_1 = __webpack_require__(/*! ./services/cartApi/cartApi */ 23);
var common_1 = __webpack_require__(/*! ./common */ 34);
var cartStorage_1 = __webpack_require__(/*! ./services/cartStorage */ 10);
var settingsManager_1 = __webpack_require__(/*! ./services/settingsManager */ 9);
var appClientService_1 = __webpack_require__(/*! ./services/appClientService */ 8);
exports.commonStoreFrontModule = angular
    .module('wix-ecommerce-common-storefront', ['eComSFSMCommon', 'debounce'])
    .config(["HttpFacadeProvider", function (HttpFacadeProvider) {
    HttpFacadeProvider.setOnInstanceUpdate(common_1.onInstanceChangeListener);
}])
    .constant('MULTILINGUAL_LANGUAGE', window.__MULTILINGUAL_LANGUAGE__)
    .directive('isTouchDevice', isTouchDevice_1.isTouchDevice)
    .directive('postLoad', postLoad_1.postLoad)
    .directive('sectionLink', sectionLink_1.sectionLink)
    .directive('focusOn', focusOn_1.focusOn)
    .directive('visualFocusOn', visualFocusOn_1.visualFocusOn)
    .factory('focus', focusOn_1.focus)
    .service('settingsManager', settingsManager_1.SettingsManager)
    .service('cartApi', cartApi_1.CartApi)
    .service('appClientService', appClientService_1.appClientService)
    .service('sdkEvents', sdkEvents_1.SdkEvents)
    .service('sdkSettings', sdkSettings_1.SdkSettings)
    .service('settingsApi', settingsApi_1.SettingsApi)
    .service('commonBiLogger', commonBiLogger_1.CommonBiLogger)
    .service('cartStorage', cartStorage_1.CartStorage).name;


/***/ }),
/* 15 */
/*!*************************************!*\
  !*** ./directives/isTouchDevice.ts ***!
  \*************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

isTouchDevice.$inject = ["$window"];
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTouchDevice = void 0;
var angular = __webpack_require__(/*! angular */ 1);
/* @ngInject */
function isTouchDevice($window) {
    var predicat = function () {
        return ('ontouchstart' in $window ||
            $window.navigator.maxTouchPoints > 0 ||
            $window.navigator.msMaxTouchPoints > 0);
    };
    return {
        restrict: 'A',
        link: function ($scope, $element) {
            if (predicat()) {
                angular.element($element).addClass('feature-touch');
            }
            else {
                angular.element($element).addClass('feature-no-touch');
            }
        },
    };
}
exports.isTouchDevice = isTouchDevice;


/***/ }),
/* 16 */
/*!********************************!*\
  !*** ./directives/postLoad.ts ***!
  \********************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

postLoad.$inject = ["$rootScope", "$timeout", "$window", "$document", "sdkAdapter", "debounce"];
Object.defineProperty(exports, "__esModule", { value: true });
exports.postLoad = void 0;
var angular = __webpack_require__(/*! angular */ 1);
/* @ngInject */
function postLoad($rootScope, $timeout, $window, $document, sdkAdapter, debounce) {
    return {
        restrict: 'A',
        scope: {
            isEnabled: '@postLoad',
        },
        link: function ($scope) {
            // allow disabling page self resizing
            $scope.isEnabled = typeof $scope.isEnabled === 'undefined' || $scope.isEnabled === 'true';
            if (!$scope.isEnabled) {
                return;
            }
            // get the right body height - http://stackoverflow.com/a/1147768/4088617
            var setHeight = debounce(function () {
                var body = $document[0].body;
                var html = $document[0].documentElement;
                var height = Math.max(body.offsetHeight, html.offsetHeight);
                sdkAdapter.setContainerHeight(height);
            }, 500);
            // Perform after images load
            angular.element($window).bind('load resize', setHeight);
            // On content changed
            $rootScope.$on('ecom.contentChanged', function () {
                $timeout(setHeight);
            });
            $rootScope.$on('$includeContentLoaded', function () {
                setHeight();
            });
        },
    };
}
exports.postLoad = postLoad;


/***/ }),
/* 17 */
/*!***********************************!*\
  !*** ./directives/sectionLink.ts ***!
  \***********************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

sectionLink.$inject = ["sdkAdapter", "experimentManager", "$compile", "clientConfig"];
Object.defineProperty(exports, "__esModule", { value: true });
exports.sectionLink = void 0;
var angular = __webpack_require__(/*! angular */ 1);
/* @ngInject */
function sectionLink(sdkAdapter, experimentManager, $compile, clientConfig) {
    return {
        restrict: 'A',
        link: function (scope, el) {
            var paramAttrValue = el.attr('section-params');
            var params = scope.$eval(paramAttrValue) || paramAttrValue;
            var sectionIdAttrValue = el.attr('section-link');
            var sectionId = scope.$eval(sectionIdAttrValue) || sectionIdAttrValue;
            var fullUrl = '';
            if (sectionId === 'product_page') {
                sdkAdapter
                    .buildCustomizedUrl('wix.stores.sub_pages.product', { slug: params }, { pathPrefix: 'product-page' })
                    .then(function (url) {
                    fullUrl = url;
                });
            }
            el.bind('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                var customResult = scope.$eval(el.attr('section-click'));
                if (customResult !== false) {
                    if (fullUrl && sectionId === 'product_page') {
                        sdkAdapter.navigateToSection({
                            sectionId: sectionId,
                            state: params,
                            customizeTarget: {
                                customUrlData: { key: 'wix.stores.sub_pages.product', variables: { slug: params } },
                            },
                        });
                    }
                    else if (angular.isObject(sectionId)) {
                        sdkAdapter.navigateToSection(sectionId);
                    }
                    else {
                        sdkAdapter.navigateToSection(sectionId, params);
                    }
                }
                scope.$eval(el.attr('section-post-click'));
            });
            sdkAdapter.getSectionUrl({ sectionId: sectionId }, function (data) {
                scope.$evalAsync(function () {
                    //tslint:disable-next-line
                    var _a = (data.url || '').split('?'), sectionUrl = _a[0], queryParams = _a[1];
                    if (params) {
                        sectionUrl += "/".concat(params);
                    }
                    sectionUrl = [sectionUrl, queryParams].filter(function (f) { return !!f; }).join('?');
                    if (clientConfig.viewMode === 'site') {
                        if (sectionId === 'product_page') {
                            el.attr('href', fullUrl);
                        }
                        else {
                            el.attr('href', sectionUrl);
                        }
                    }
                });
            });
        },
    };
}
exports.sectionLink = sectionLink;


/***/ }),
/* 18 */
/*!*********************************************!*\
  !*** ./services/settingsApi/settingsApi.ts ***!
  \*********************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsApi = void 0;
var SettingsApi = /** @class */ (function () {
    /* @ngInject */
    SettingsApi.$inject = ["HttpFacade", "topology", "clientConfig"];
    function SettingsApi(HttpFacade, topology, clientConfig) {
        this.HttpFacade = HttpFacade;
        this.topology = topology;
        this.clientConfig = clientConfig;
    }
    SettingsApi.prototype.getGalleryCollections = function () {
        return this.HttpFacade.doHTTPQl({
            query: __webpack_require__(/*! ./getGalleryCollections.graphql */ 19).loc.source.body,
            operationName: 'GallerySettings',
        }).then(function (data) {
            return data.catalog.categories.list;
        });
    };
    SettingsApi.prototype.getProductList = function () {
        var _this = this;
        return this.HttpFacade.doHTTPQl({
            query: __webpack_require__(/*! ./getProductList.graphql */ 20).loc.source.body,
            operationName: 'ProductWidgetSettings',
        }).then(function (data) {
            return _this.convertQueryResultToProducts(data);
        });
    };
    SettingsApi.prototype.saveCategorySettings = function (compId, categoryId) {
        var replacements = this.getBasicReplacements();
        var data = {
            compId: compId,
            categoryId: categoryId,
        };
        var templateUrl = this.topology.saveComponentSettingsUrl;
        return this.HttpFacade.doHTTPPost({}, templateUrl, replacements, data);
    };
    SettingsApi.prototype.getBasicReplacements = function () {
        return {
            storeId: this.clientConfig.storeId,
        };
    };
    SettingsApi.prototype.convertQueryResultToProducts = function (data) {
        return data.products.map(function (el) {
            return {
                id: el.id,
                name: el.name,
                isVisible: el.isVisible,
                mediaUrl: el.media.length > 0 ? el.media[0].url : '',
            };
        });
    };
    return SettingsApi;
}());
exports.SettingsApi = SettingsApi;


/***/ }),
/* 19 */
/*!************************************************************!*\
  !*** ./services/settingsApi/getGalleryCollections.graphql ***!
  \************************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {


    var doc = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getGalleryCollections"},"variableDefinitions":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"catalog"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"categories"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"400"}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"list"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"id"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"name"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"media"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"url"},"arguments":[],"directives":[],"selectionSet":null}]}}]}}]}}]}}]}}],"loc":{"start":0,"end":168}};
    doc.loc.source = {"body":"query getGalleryCollections {\n    catalog {\n      categories(limit: 400) {\n        list {\n          id\n          name\n          media { url }\n        }\n      }\n    }\n}\n","name":"GraphQL"};
  

    var names = {};
    function unique(defs) {
      return defs.filter(
        function(def) {
          if (def.kind !== 'FragmentDefinition') return true;
          var name = def.name.value
          if (names[name]) {
            return false;
          } else {
            names[name] = true;
            return true;
          }
        }
      )
    }
  

    // Collect any fragment/type references from a node, adding them to the refs Set
    function collectFragmentReferences(node, refs) {
      if (node.kind === "FragmentSpread") {
        refs.add(node.name.value);
      } else if (node.kind === "VariableDefinition") {
        var type = node.type;
        if (type.kind === "NamedType") {
          refs.add(type.name.value);
        }
      }

      if (node.selectionSet) {
        node.selectionSet.selections.forEach(function(selection) {
          collectFragmentReferences(selection, refs);
        });
      }

      if (node.variableDefinitions) {
        node.variableDefinitions.forEach(function(def) {
          collectFragmentReferences(def, refs);
        });
      }

      if (node.definitions) {
        node.definitions.forEach(function(def) {
          collectFragmentReferences(def, refs);
        });
      }
    }

    var definitionRefs = {};
    (function extractReferences() {
      doc.definitions.forEach(function(def) {
        if (def.name) {
          var refs = new Set();
          collectFragmentReferences(def, refs);
          definitionRefs[def.name.value] = refs;
        }
      });
    })();

    function findOperation(doc, name) {
      for (var i = 0; i < doc.definitions.length; i++) {
        var element = doc.definitions[i];
        if (element.name && element.name.value == name) {
          return element;
        }
      }
    }

    function oneQuery(doc, operationName) {
      // Copy the DocumentNode, but clear out the definitions
      var newDoc = {
        kind: doc.kind,
        definitions: [findOperation(doc, operationName)]
      };
      if (doc.hasOwnProperty("loc")) {
        newDoc.loc = doc.loc;
      }

      // Now, for the operation we're running, find any fragments referenced by
      // it or the fragments it references
      var opRefs = definitionRefs[operationName] || new Set();
      var allRefs = new Set();
      var newRefs = new Set();

      // IE 11 doesn't support "new Set(iterable)", so we add the members of opRefs to newRefs one by one
      opRefs.forEach(function(refName) {
        newRefs.add(refName);
      });

      while (newRefs.size > 0) {
        var prevRefs = newRefs;
        newRefs = new Set();

        prevRefs.forEach(function(refName) {
          if (!allRefs.has(refName)) {
            allRefs.add(refName);
            var childRefs = definitionRefs[refName] || new Set();
            childRefs.forEach(function(childRef) {
              newRefs.add(childRef);
            });
          }
        });
      }

      allRefs.forEach(function(refName) {
        var op = findOperation(doc, refName);
        if (op) {
          newDoc.definitions.push(op);
        }
      });

      return newDoc;
    }

    module.exports = doc;
    
        module.exports["getGalleryCollections"] = oneQuery(doc, "getGalleryCollections");
        


/***/ }),
/* 20 */
/*!*****************************************************!*\
  !*** ./services/settingsApi/getProductList.graphql ***!
  \*****************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {


    var doc = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getProductList"},"variableDefinitions":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"products"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"400"}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"id"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"name"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"isVisible"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"media"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"url"},"arguments":[],"directives":[],"selectionSet":null}]}}]}}]}}],"loc":{"start":0,"end":150}};
    doc.loc.source = {"body":"query getProductList {\n    products(limit:400) {\n        id\n        name\n        isVisible\n        media(limit:1) {\n            url\n        }\n    }\n}\n","name":"GraphQL"};
  

    var names = {};
    function unique(defs) {
      return defs.filter(
        function(def) {
          if (def.kind !== 'FragmentDefinition') return true;
          var name = def.name.value
          if (names[name]) {
            return false;
          } else {
            names[name] = true;
            return true;
          }
        }
      )
    }
  

    // Collect any fragment/type references from a node, adding them to the refs Set
    function collectFragmentReferences(node, refs) {
      if (node.kind === "FragmentSpread") {
        refs.add(node.name.value);
      } else if (node.kind === "VariableDefinition") {
        var type = node.type;
        if (type.kind === "NamedType") {
          refs.add(type.name.value);
        }
      }

      if (node.selectionSet) {
        node.selectionSet.selections.forEach(function(selection) {
          collectFragmentReferences(selection, refs);
        });
      }

      if (node.variableDefinitions) {
        node.variableDefinitions.forEach(function(def) {
          collectFragmentReferences(def, refs);
        });
      }

      if (node.definitions) {
        node.definitions.forEach(function(def) {
          collectFragmentReferences(def, refs);
        });
      }
    }

    var definitionRefs = {};
    (function extractReferences() {
      doc.definitions.forEach(function(def) {
        if (def.name) {
          var refs = new Set();
          collectFragmentReferences(def, refs);
          definitionRefs[def.name.value] = refs;
        }
      });
    })();

    function findOperation(doc, name) {
      for (var i = 0; i < doc.definitions.length; i++) {
        var element = doc.definitions[i];
        if (element.name && element.name.value == name) {
          return element;
        }
      }
    }

    function oneQuery(doc, operationName) {
      // Copy the DocumentNode, but clear out the definitions
      var newDoc = {
        kind: doc.kind,
        definitions: [findOperation(doc, operationName)]
      };
      if (doc.hasOwnProperty("loc")) {
        newDoc.loc = doc.loc;
      }

      // Now, for the operation we're running, find any fragments referenced by
      // it or the fragments it references
      var opRefs = definitionRefs[operationName] || new Set();
      var allRefs = new Set();
      var newRefs = new Set();

      // IE 11 doesn't support "new Set(iterable)", so we add the members of opRefs to newRefs one by one
      opRefs.forEach(function(refName) {
        newRefs.add(refName);
      });

      while (newRefs.size > 0) {
        var prevRefs = newRefs;
        newRefs = new Set();

        prevRefs.forEach(function(refName) {
          if (!allRefs.has(refName)) {
            allRefs.add(refName);
            var childRefs = definitionRefs[refName] || new Set();
            childRefs.forEach(function(childRef) {
              newRefs.add(childRef);
            });
          }
        });
      }

      allRefs.forEach(function(refName) {
        var op = findOperation(doc, refName);
        if (op) {
          newDoc.definitions.push(op);
        }
      });

      return newDoc;
    }

    module.exports = doc;
    
        module.exports["getProductList"] = oneQuery(doc, "getProductList");
        


/***/ }),
/* 21 */
/*!************************************!*\
  !*** ./services/commonBiLogger.ts ***!
  \************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonBiLogger = void 0;
var CommonBiLogger = /** @class */ (function () {
    /* @ngInject */
    CommonBiLogger.$inject = ["wixBIAdapter", "clientConfig", "sdkAdapter"];
    function CommonBiLogger(wixBIAdapter, clientConfig, sdkAdapter) {
        this.wixBIAdapter = wixBIAdapter;
        this.clientConfig = clientConfig;
        this.sdkAdapter = sdkAdapter;
        this.VIEW_PAGE_ON_EDITOR_OR_VIEWER = {
            evid: 18,
        };
    }
    CommonBiLogger.prototype.sendPageLoaded = function (pageId) {
        var biData = {
            pageId: pageId,
            isMerchant: this.clientConfig.isMerchant,
        };
        if (this.sdkAdapter.isEditMode() || this.sdkAdapter.isPreviewMode()) {
            biData.origin = this.sdkAdapter.isEditMode() ? 'editor' : 'viewer';
            this.wixBIAdapter.sendBIEvent(this.VIEW_PAGE_ON_EDITOR_OR_VIEWER, biData);
        }
    };
    return CommonBiLogger;
}());
exports.CommonBiLogger = CommonBiLogger;


/***/ }),
/* 22 */
/*!****************************!*\
  !*** ./enums/siteEvent.ts ***!
  \****************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.siteEventTypeEnum = void 0;
var siteEventTypeEnum;
(function (siteEventTypeEnum) {
    siteEventTypeEnum[siteEventTypeEnum["EDIT_MODE_CHANGE"] = 0] = "EDIT_MODE_CHANGE";
    siteEventTypeEnum[siteEventTypeEnum["PAGE_NAVIGATION"] = 1] = "PAGE_NAVIGATION";
    siteEventTypeEnum[siteEventTypeEnum["PAGE_NAVIGATION_IN"] = 2] = "PAGE_NAVIGATION_IN";
    siteEventTypeEnum[siteEventTypeEnum["PUBLIC_DATA_CHANGED"] = 3] = "PUBLIC_DATA_CHANGED";
    siteEventTypeEnum[siteEventTypeEnum["COMPONENT_DELETED"] = 4] = "COMPONENT_DELETED";
    siteEventTypeEnum[siteEventTypeEnum["STYLE_PARAMS_CHANGE"] = 5] = "STYLE_PARAMS_CHANGE";
    siteEventTypeEnum[siteEventTypeEnum["SITE_SCROLL"] = 6] = "SITE_SCROLL";
    siteEventTypeEnum[siteEventTypeEnum["SETTINGS_UPDATED"] = 7] = "SETTINGS_UPDATED";
})(siteEventTypeEnum = exports.siteEventTypeEnum || (exports.siteEventTypeEnum = {}));


/***/ }),
/* 23 */
/*!*************************************!*\
  !*** ./services/cartApi/cartApi.ts ***!
  \*************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CartApi = void 0;
var cart_services_1 = __webpack_require__(/*! @wix/wixstores-client-core/dist/src/common/cart-services/cart-services */ 24);
var CartApi = /** @class */ (function () {
    /* @ngInject */
    CartApi.$inject = ["HttpFacade", "topology", "clientConfig", "$q", "experimentManager", "CommandsExecutorFactory"];
    function CartApi(HttpFacade, topology, clientConfig, $q, experimentManager, CommandsExecutorFactory) {
        this.HttpFacade = HttpFacade;
        this.topology = topology;
        this.clientConfig = clientConfig;
        this.$q = $q;
        this.experimentManager = experimentManager;
        this.CommandsExecutorFactory = CommandsExecutorFactory;
    }
    CartApi.prototype.getBasicReplacements = function () {
        var replacements = {
            storeId: this.clientConfig.storeId,
        };
        return replacements;
    };
    CartApi.prototype.removeCartItem = function (cartItemId, cartId) {
        var params = {
            cartId: cartId,
            cartItemId: cartItemId,
        };
        return this.HttpFacade.doHTTPQl({
            variables: { params: params, withTax: false, withShipping: false },
            query: __webpack_require__(/*! ./removeCartItem.graphql */ 32).loc.source.body,
            operationName: 'removeCartItem',
        }).then(function (response) {
            var _a = response.cart.removeItem, cart = _a.cart, errors = _a.errors;
            return { cartSummary: (0, cart_services_1.newCartToOldCartStructure)(cart), errors: errors };
        });
    };
    CartApi.prototype.addToCart = function (productId, optionsSelections, quantity, customTextFields) {
        if (customTextFields === void 0) { customTextFields = []; }
        var postData = {
            productId: productId,
            quantity: quantity,
        };
        if (Array.isArray(optionsSelections)) {
            postData.optionsSelections = optionsSelections;
        }
        else {
            postData.optionsSelectionsByNames = optionsSelections;
        }
        postData.freeText = customTextFields.map(function (customTextFieldAnswer) {
            return {
                title: customTextFieldAnswer.customText.title,
                value: customTextFieldAnswer.answer,
            };
        });
        var commandExecutor = new this.CommandsExecutorFactory();
        return commandExecutor.executeSingleCommand(this.topology.cartStoreFrontCommandsUrl, 'AddCartItemCommand', postData);
    };
    CartApi.prototype.updateCartItemQuantity = function (cartItemId, quantity, cartId) {
        var params = {
            cartId: cartId,
            cartItemId: cartItemId,
            quantity: quantity,
        };
        return this.HttpFacade.doHTTPQl({
            variables: { params: params, withTax: false, withShipping: false },
            query: __webpack_require__(/*! ./updateItemQuantity.graphql */ 33).loc.source.body,
            operationName: 'updateItemQuantity',
        }).then(function (response) {
            var _a = response.cart.updateItemQuantity, cart = _a.cart, errors = _a.errors;
            return { cartSummary: (0, cart_services_1.newCartToOldCartStructure)(cart), errors: errors };
        });
    };
    return CartApi;
}());
exports.CartApi = CartApi;


/***/ }),
/* 24 */
/*!*************************************************************************************************!*\
  !*** ../node_modules/@wix/wixstores-client-core/dist/src/common/cart-services/cart-services.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CartServices = exports.newCartToOldCartStructure = void 0;
var tslib_1 = __webpack_require__(/*! tslib */ 0);
var types_1 = __webpack_require__(/*! ../../types */ 25);
var cart_1 = __webpack_require__(/*! ../../types/cart */ 7);
function newCartToOldCartStructure(newCart) {
    var oldCart = tslib_1.__assign({}, newCart);
    oldCart.items = (oldCart.items || []).map(function (item) { return (tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, item), item.product), { media: item.product.media[0] || EmptyMedia })); });
    return oldCart;
}
exports.newCartToOldCartStructure = newCartToOldCartStructure;
var EmptyMedia = {
    altText: null,
    height: 0,
    width: 0,
    mediaType: types_1.MediaType.PHOTO,
    url: '',
};
var CartServices = /** @class */ (function () {
    function CartServices(sdkAdapter) {
        this.sdkAdapter = sdkAdapter;
        //
    }
    CartServices.prototype.notifyCartChange = function (cart, extraParams) {
        var cartOldStructure = tslib_1.__assign(tslib_1.__assign({}, newCartToOldCartStructure(cart)), { extraParams: extraParams });
        delete cartOldStructure.billingAddress;
        delete cartOldStructure.shippingAddress;
        this.sdkAdapter.publish(cart_1.CartEvents.CHANGED, cartOldStructure, false);
    };
    CartServices.prototype.subscribeToCartChanges = function (listener) {
        this.sdkAdapter.subscribe(cart_1.CartEvents.CHANGED, function (e) { return listener(e.data); }, false);
    };
    CartServices.prototype.subscribeToCartCleared = function (listener) {
        this.sdkAdapter.subscribe(cart_1.CartEvents.CLEARED, function (e) { return listener(e.data); }, false);
    };
    return CartServices;
}());
exports.CartServices = CartServices;
//# sourceMappingURL=cart-services.js.map

/***/ }),
/* 25 */
/*!********************************************************************!*\
  !*** ../node_modules/@wix/wixstores-client-core/dist/src/types.js ***!
  \********************************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var media_item_1 = __webpack_require__(/*! ./types/media-item */ 26);
Object.defineProperty(exports, "MediaType", { enumerable: true, get: function () { return media_item_1.MediaType; } });
var cart_1 = __webpack_require__(/*! ./types/cart */ 7);
Object.defineProperty(exports, "CartType", { enumerable: true, get: function () { return cart_1.CartType; } });
Object.defineProperty(exports, "CartEvents", { enumerable: true, get: function () { return cart_1.CartEvents; } });
var product_1 = __webpack_require__(/*! ./types/product */ 27);
Object.defineProperty(exports, "MediaFrameMediaType", { enumerable: true, get: function () { return product_1.MediaFrameMediaType; } });
Object.defineProperty(exports, "ProductType", { enumerable: true, get: function () { return product_1.ProductType; } });
var settings_updated_event_1 = __webpack_require__(/*! ./types/settings-updated-event */ 28);
Object.defineProperty(exports, "SettingsUpdatedEvent", { enumerable: true, get: function () { return settings_updated_event_1.SettingsUpdatedEvent; } });
Object.defineProperty(exports, "OrderHistoryViewMode", { enumerable: true, get: function () { return settings_updated_event_1.OrderHistoryViewMode; } });
var shipping_rule_status_1 = __webpack_require__(/*! ./types/shipping-rule-status */ 29);
Object.defineProperty(exports, "ShippingRuleStatus", { enumerable: true, get: function () { return shipping_rule_status_1.ShippingRuleStatus; } });
var track_event_1 = __webpack_require__(/*! ./types/track-event */ 30);
Object.defineProperty(exports, "TrackEventName", { enumerable: true, get: function () { return track_event_1.TrackEventName; } });
var wix_html_attributes_1 = __webpack_require__(/*! ./types/wix-html-attributes */ 31);
Object.defineProperty(exports, "WixHtmlAttributes", { enumerable: true, get: function () { return wix_html_attributes_1.WixHtmlAttributes; } });
//# sourceMappingURL=types.js.map

/***/ }),
/* 26 */
/*!*******************************************************************************!*\
  !*** ../node_modules/@wix/wixstores-client-core/dist/src/types/media-item.js ***!
  \*******************************************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaType = void 0;
var MediaType;
(function (MediaType) {
    MediaType[MediaType["PHOTO"] = 'PHOTO'] = "PHOTO";
    MediaType[MediaType["VIDEO"] = 'VIDEO'] = "VIDEO";
})(MediaType = exports.MediaType || (exports.MediaType = {}));
//# sourceMappingURL=media-item.js.map

/***/ }),
/* 27 */
/*!****************************************************************************!*\
  !*** ../node_modules/@wix/wixstores-client-core/dist/src/types/product.js ***!
  \****************************************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaFrameMediaType = exports.IProductPreOrderAvailability = exports.ProductInventoryStatus = exports.ProductType = void 0;
var ProductType;
(function (ProductType) {
    ProductType["DIGITAL"] = "digital";
    ProductType["PHYSICAL"] = "physical";
    ProductType["SERVICE"] = "service";
    ProductType["GIFT_CARD"] = "gift_card";
    ProductType["UNRECOGNISED"] = "unrecognised";
})(ProductType = exports.ProductType || (exports.ProductType = {}));
var ProductInventoryStatus;
(function (ProductInventoryStatus) {
    ProductInventoryStatus["OUT_OF_STOCK"] = "out_of_stock";
    ProductInventoryStatus["IN_STOCK"] = "in_stock";
})(ProductInventoryStatus = exports.ProductInventoryStatus || (exports.ProductInventoryStatus = {}));
var IProductPreOrderAvailability;
(function (IProductPreOrderAvailability) {
    IProductPreOrderAvailability["ALL_VARIANTS"] = "all_variants";
    IProductPreOrderAvailability["NO_VARIANTS"] = "no_variants";
    IProductPreOrderAvailability["SOME_VARIANTS"] = "some_variants";
})(IProductPreOrderAvailability = exports.IProductPreOrderAvailability || (exports.IProductPreOrderAvailability = {}));
var MediaFrameMediaType;
(function (MediaFrameMediaType) {
    MediaFrameMediaType["SECURE_PICTURE"] = "secure_picture";
    MediaFrameMediaType["SECURE_VIDEO"] = "secure_video";
    MediaFrameMediaType["SECURE_DOCUMENT"] = "secure_document";
    MediaFrameMediaType["SECURE_MUSIC"] = "secure_music";
    MediaFrameMediaType["SECURE_ARCHIVE"] = "secure_archive";
})(MediaFrameMediaType = exports.MediaFrameMediaType || (exports.MediaFrameMediaType = {}));
//# sourceMappingURL=product.js.map

/***/ }),
/* 28 */
/*!*******************************************************************************************!*\
  !*** ../node_modules/@wix/wixstores-client-core/dist/src/types/settings-updated-event.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderHistoryViewMode = exports.SettingsUpdatedEvent = void 0;
var SettingsUpdatedEvent;
(function (SettingsUpdatedEvent) {
    SettingsUpdatedEvent[SettingsUpdatedEvent["FREE_TEXT"] = 'free_text'] = "FREE_TEXT";
    SettingsUpdatedEvent[SettingsUpdatedEvent["LINK_CHANGED"] = 'link_changed'] = "LINK_CHANGED";
    SettingsUpdatedEvent[SettingsUpdatedEvent["ORDER_HISTORY_VIEW_MODE_CHANGED"] = 'order_history_view_mode_changed'] = "ORDER_HISTORY_VIEW_MODE_CHANGED";
})(SettingsUpdatedEvent = exports.SettingsUpdatedEvent || (exports.SettingsUpdatedEvent = {}));
var OrderHistoryViewMode;
(function (OrderHistoryViewMode) {
    OrderHistoryViewMode[OrderHistoryViewMode["DEMO"] = 'demo'] = "DEMO";
    OrderHistoryViewMode[OrderHistoryViewMode["EMPTY_STATE"] = 'empty_state'] = "EMPTY_STATE";
})(OrderHistoryViewMode = exports.OrderHistoryViewMode || (exports.OrderHistoryViewMode = {}));
//# sourceMappingURL=settings-updated-event.js.map

/***/ }),
/* 29 */
/*!*****************************************************************************************!*\
  !*** ../node_modules/@wix/wixstores-client-core/dist/src/types/shipping-rule-status.js ***!
  \*****************************************************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingRuleStatus = void 0;
var ShippingRuleStatus;
(function (ShippingRuleStatus) {
    ShippingRuleStatus["MissingZipCode"] = "MissingZipCode";
    ShippingRuleStatus["NoShipppingToDestination"] = "NoShipppingToDestination";
    ShippingRuleStatus["UnsupportedRegion"] = "UnsupportedRegion";
    ShippingRuleStatus["OK"] = "OK";
    ShippingRuleStatus["FullAddressRequired"] = "FullAddressRequired";
})(ShippingRuleStatus = exports.ShippingRuleStatus || (exports.ShippingRuleStatus = {}));
//# sourceMappingURL=shipping-rule-status.js.map

/***/ }),
/* 30 */
/*!********************************************************************************!*\
  !*** ../node_modules/@wix/wixstores-client-core/dist/src/types/track-event.js ***!
  \********************************************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackEventName = void 0;
var TrackEventName;
(function (TrackEventName) {
    TrackEventName["VIEW_CONTENT"] = "ViewContent";
    TrackEventName["SEARCH"] = "Search";
    TrackEventName["ADD_TO_CART"] = "AddToCart";
    TrackEventName["ADD_TO_WISHLIST"] = "AddToWishlist";
    TrackEventName["INITIATE_CHECKOUT"] = "InitiateCheckout";
    TrackEventName["ADD_PAYMENT_INFO"] = "AddPaymentInfo";
    TrackEventName["PURCHASE"] = "Purchase";
    TrackEventName["LEAD"] = "Lead";
    TrackEventName["COMPLETE_REGISTRATION"] = "CompleteRegistration";
    TrackEventName["CUSTOM_EVENT"] = "CustomEvent";
    TrackEventName["REMOVE_FROM_CART"] = "RemoveFromCart";
    TrackEventName["CHECKOUT_STEP"] = "CheckoutStep";
})(TrackEventName = exports.TrackEventName || (exports.TrackEventName = {}));
//# sourceMappingURL=track-event.js.map

/***/ }),
/* 31 */
/*!****************************************************************************************!*\
  !*** ../node_modules/@wix/wixstores-client-core/dist/src/types/wix-html-attributes.js ***!
  \****************************************************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.WixHtmlAttributes = void 0;
// must not be changed, used by 3rd party integrators - please talk to ariel livshits before changing
var WixHtmlAttributes;
(function (WixHtmlAttributes) {
    WixHtmlAttributes["DataWixPrice"] = "data-wix-price";
    WixHtmlAttributes["DataWixOriginalPrice"] = "data-wix-original-price";
    WixHtmlAttributes["DataWixCheckoutButton"] = "data-wix-checkout-button";
    WixHtmlAttributes["DataWixHideable"] = "data-wix-hideable";
    WixHtmlAttributes["DataWixIgnoreable"] = "data-wix-ignorable";
    WixHtmlAttributes["DataWixPricePerUnit"] = "data-wix-price-per-unit";
    WixHtmlAttributes["DataWixQuantity"] = "data-wix-quantity";
    WixHtmlAttributes["DataWixShowable"] = "data-wix-showable";
})(WixHtmlAttributes = exports.WixHtmlAttributes || (exports.WixHtmlAttributes = {}));
//# sourceMappingURL=wix-html-attributes.js.map

/***/ }),
/* 32 */
/*!*************************************************!*\
  !*** ./services/cartApi/removeCartItem.graphql ***!
  \*************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {


    var doc = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"removeCartItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"params"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemoveItemInput"}}},"defaultValue":null},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"withTax"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"defaultValue":null},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"withShipping"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"defaultValue":null}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"cart"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"removeItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"params"},"value":{"kind":"Variable","name":{"kind":"Name","value":"params"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"errors"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"code"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"commandName"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"message"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"field"},"arguments":[],"directives":[],"selectionSet":null}]}},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"cart"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"cartId"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"storeId"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"buyerNote"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"items"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"cartItemId"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"catalogAppId"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"convertedFormattedComparePrice"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"convertedFormattedPrice"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"convertedFormattedTotalPrice"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"convertedPrices"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"comparePrice"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedComparePrice"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedPriceBeforeDiscount"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedPrice"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedTotalPrice"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"price"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"totalPrice"},"arguments":[],"directives":[],"selectionSet":null}]}},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"product"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"comparePrice"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"convertedComparePrice"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"convertedPrice"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"customTextFields"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"title"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"value"},"arguments":[],"directives":[],"selectionSet":null}]}},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"id"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"productType"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"urlPart"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"name"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"pageUrl"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"price"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"sku"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"weight"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"media"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"altText"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"mediaType"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"url"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"height"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"width"},"arguments":[],"directives":[],"selectionSet":null}]}},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"digitalProductFileItems"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"fileType"},"arguments":[],"directives":[],"selectionSet":null}]}}]}},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"optionsSelectionsValues"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"id"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"title"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"value"},"arguments":[],"directives":[],"selectionSet":null}]}},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"convertedTotalPrice"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"freeText"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"title"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"value"},"arguments":[],"directives":[],"selectionSet":null}]}},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"sku"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"quantity"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"inventoryQuantity"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedComparePrice"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedPriceBeforeDiscount"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedPrice"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedTotalPrice"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"subscriptionPlan"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"id"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"name"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"tagline"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"frequency"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"duration"},"arguments":[],"directives":[],"selectionSet":null}]}},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"totalPrice"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"discountRules"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"name"},"arguments":[],"directives":[],"selectionSet":null}]}}]}},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"totals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"withTax"},"value":{"kind":"Variable","name":{"kind":"Name","value":"withTax"}}},{"kind":"Argument","name":{"kind":"Name","value":"withShipping"},"value":{"kind":"Variable","name":{"kind":"Name","value":"withShipping"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"subTotal"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"shipping"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"tax"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"total"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"discount"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"shippingWithoutTax"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"giftCardAmount"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedSubTotal"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedShipping"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedTax"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"originalTotal"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"itemsTotal"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedItemsTotal"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedOriginalTotal"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedTotalBeforeTax"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedTotal"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedDiscount"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedShippingWithoutTax"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedGiftCardAmount"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"totalBeforeTax"},"arguments":[],"directives":[],"selectionSet":null}]}},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"convertedTotals"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"discount"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedDiscount"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedGiftCardAmount"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedItemsTotal"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedOriginalTotal"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedShipping"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedShippingWithoutTax"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedSubTotal"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedTax"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedTotal"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedTotalBeforeTax"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"giftCardAmount"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"itemsTotal"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"originalTotal"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"shipping"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"shippingWithoutTax"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"subTotal"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"tax"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"total"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"totalBeforeTax"},"arguments":[],"directives":[],"selectionSet":null}]}}]}}]}}]}}]}}],"loc":{"start":0,"end":3039}};
    doc.loc.source = {"body":"mutation removeCartItem($params: RemoveItemInput!, $withTax: Boolean, $withShipping: Boolean) {\n  cart {\n    removeItem(params: $params) {\n      errors {\n        code\n        commandName\n        message\n        field\n      }\n      cart {\n        cartId\n        storeId\n        buyerNote\n        items {\n          cartItemId\n          catalogAppId\n          convertedFormattedComparePrice\n          convertedFormattedPrice\n          convertedFormattedTotalPrice\n          convertedPrices {\n            comparePrice\n            formattedComparePrice\n            formattedPriceBeforeDiscount\n            formattedPrice\n            formattedTotalPrice\n            price\n            totalPrice\n          }\n          product {\n            comparePrice\n            convertedComparePrice\n            convertedPrice\n            customTextFields {\n              title\n              value\n            }\n            id\n            productType\n            urlPart\n            name\n            pageUrl\n            price\n            sku\n            weight\n            media(limit: 1) {\n              altText\n              mediaType\n              url\n              height\n              width\n            }\n            digitalProductFileItems {\n              fileType\n            }\n          }\n          optionsSelectionsValues {\n            id\n            title\n            value\n          }\n          convertedTotalPrice\n          freeText {\n            title\n            value\n          }\n          sku\n          quantity\n          inventoryQuantity\n          formattedComparePrice\n          formattedPriceBeforeDiscount\n          formattedPrice\n          formattedTotalPrice\n          subscriptionPlan {\n            id\n            name\n            tagline\n            frequency\n            duration\n          }\n          totalPrice\n          discountRules {\n            name\n          }\n        }\n        totals(withTax: $withTax, withShipping: $withShipping) {\n          subTotal\n          shipping\n          tax\n          total\n          discount\n          shippingWithoutTax\n          giftCardAmount\n          formattedSubTotal\n          formattedShipping\n          formattedTax\n          originalTotal\n          itemsTotal\n          formattedItemsTotal\n          formattedOriginalTotal\n          formattedTotalBeforeTax\n          formattedTotal\n          formattedDiscount\n          formattedShippingWithoutTax\n          formattedGiftCardAmount\n          totalBeforeTax\n        }\n        convertedTotals {\n          discount\n          formattedDiscount\n          formattedGiftCardAmount\n          formattedItemsTotal\n          formattedOriginalTotal\n          formattedShipping\n          formattedShippingWithoutTax\n          formattedSubTotal\n          formattedTax\n          formattedTotal\n          formattedTotalBeforeTax\n          giftCardAmount\n          itemsTotal\n          originalTotal\n          shipping\n          shippingWithoutTax\n          subTotal\n          tax\n          total\n          totalBeforeTax\n        }\n      }\n    }\n  }\n}\n","name":"GraphQL"};
  

    var names = {};
    function unique(defs) {
      return defs.filter(
        function(def) {
          if (def.kind !== 'FragmentDefinition') return true;
          var name = def.name.value
          if (names[name]) {
            return false;
          } else {
            names[name] = true;
            return true;
          }
        }
      )
    }
  

    // Collect any fragment/type references from a node, adding them to the refs Set
    function collectFragmentReferences(node, refs) {
      if (node.kind === "FragmentSpread") {
        refs.add(node.name.value);
      } else if (node.kind === "VariableDefinition") {
        var type = node.type;
        if (type.kind === "NamedType") {
          refs.add(type.name.value);
        }
      }

      if (node.selectionSet) {
        node.selectionSet.selections.forEach(function(selection) {
          collectFragmentReferences(selection, refs);
        });
      }

      if (node.variableDefinitions) {
        node.variableDefinitions.forEach(function(def) {
          collectFragmentReferences(def, refs);
        });
      }

      if (node.definitions) {
        node.definitions.forEach(function(def) {
          collectFragmentReferences(def, refs);
        });
      }
    }

    var definitionRefs = {};
    (function extractReferences() {
      doc.definitions.forEach(function(def) {
        if (def.name) {
          var refs = new Set();
          collectFragmentReferences(def, refs);
          definitionRefs[def.name.value] = refs;
        }
      });
    })();

    function findOperation(doc, name) {
      for (var i = 0; i < doc.definitions.length; i++) {
        var element = doc.definitions[i];
        if (element.name && element.name.value == name) {
          return element;
        }
      }
    }

    function oneQuery(doc, operationName) {
      // Copy the DocumentNode, but clear out the definitions
      var newDoc = {
        kind: doc.kind,
        definitions: [findOperation(doc, operationName)]
      };
      if (doc.hasOwnProperty("loc")) {
        newDoc.loc = doc.loc;
      }

      // Now, for the operation we're running, find any fragments referenced by
      // it or the fragments it references
      var opRefs = definitionRefs[operationName] || new Set();
      var allRefs = new Set();
      var newRefs = new Set();

      // IE 11 doesn't support "new Set(iterable)", so we add the members of opRefs to newRefs one by one
      opRefs.forEach(function(refName) {
        newRefs.add(refName);
      });

      while (newRefs.size > 0) {
        var prevRefs = newRefs;
        newRefs = new Set();

        prevRefs.forEach(function(refName) {
          if (!allRefs.has(refName)) {
            allRefs.add(refName);
            var childRefs = definitionRefs[refName] || new Set();
            childRefs.forEach(function(childRef) {
              newRefs.add(childRef);
            });
          }
        });
      }

      allRefs.forEach(function(refName) {
        var op = findOperation(doc, refName);
        if (op) {
          newDoc.definitions.push(op);
        }
      });

      return newDoc;
    }

    module.exports = doc;
    
        module.exports["removeCartItem"] = oneQuery(doc, "removeCartItem");
        


/***/ }),
/* 33 */
/*!*****************************************************!*\
  !*** ./services/cartApi/updateItemQuantity.graphql ***!
  \*****************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {


    var doc = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateItemQuantity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"params"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateItemQuantityInput"}}},"defaultValue":null},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"withTax"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"defaultValue":null},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"withShipping"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"defaultValue":null}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"cart"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"updateItemQuantity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"params"},"value":{"kind":"Variable","name":{"kind":"Name","value":"params"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"errors"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"code"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"commandName"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"message"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"field"},"arguments":[],"directives":[],"selectionSet":null}]}},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"cart"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"cartId"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"storeId"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"buyerNote"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"items"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"cartItemId"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"catalogAppId"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"convertedFormattedComparePrice"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"convertedFormattedPrice"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"convertedFormattedTotalPrice"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"convertedPrices"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"comparePrice"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedComparePrice"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedPriceBeforeDiscount"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedPrice"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedTotalPrice"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"price"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"totalPrice"},"arguments":[],"directives":[],"selectionSet":null}]}},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"product"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"comparePrice"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"convertedComparePrice"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"convertedPrice"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"customTextFields"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"title"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"value"},"arguments":[],"directives":[],"selectionSet":null}]}},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"id"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"productType"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"urlPart"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"name"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"pageUrl"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"price"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"sku"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"weight"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"media"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"altText"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"mediaType"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"url"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"height"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"width"},"arguments":[],"directives":[],"selectionSet":null}]}},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"digitalProductFileItems"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"fileType"},"arguments":[],"directives":[],"selectionSet":null}]}}]}},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"optionsSelectionsValues"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"id"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"title"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"value"},"arguments":[],"directives":[],"selectionSet":null}]}},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"convertedTotalPrice"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"freeText"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"title"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"value"},"arguments":[],"directives":[],"selectionSet":null}]}},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"sku"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"quantity"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"inventoryQuantity"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedComparePrice"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedPriceBeforeDiscount"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedPrice"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedTotalPrice"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"subscriptionPlan"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"id"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"name"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"tagline"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"frequency"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"duration"},"arguments":[],"directives":[],"selectionSet":null}]}},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"totalPrice"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"discountRules"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"name"},"arguments":[],"directives":[],"selectionSet":null}]}}]}},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"totals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"withTax"},"value":{"kind":"Variable","name":{"kind":"Name","value":"withTax"}}},{"kind":"Argument","name":{"kind":"Name","value":"withShipping"},"value":{"kind":"Variable","name":{"kind":"Name","value":"withShipping"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"subTotal"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"shipping"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"tax"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"total"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"discount"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"shippingWithoutTax"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"giftCardAmount"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedSubTotal"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedShipping"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedTax"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"originalTotal"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"itemsTotal"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedItemsTotal"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedOriginalTotal"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedTotalBeforeTax"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedTotal"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedDiscount"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedShippingWithoutTax"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedGiftCardAmount"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"totalBeforeTax"},"arguments":[],"directives":[],"selectionSet":null}]}},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"convertedTotals"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":null,"name":{"kind":"Name","value":"discount"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedDiscount"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedGiftCardAmount"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedItemsTotal"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedOriginalTotal"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedShipping"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedShippingWithoutTax"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedSubTotal"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedTax"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedTotal"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"formattedTotalBeforeTax"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"giftCardAmount"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"itemsTotal"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"originalTotal"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"shipping"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"shippingWithoutTax"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"subTotal"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"tax"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"total"},"arguments":[],"directives":[],"selectionSet":null},{"kind":"Field","alias":null,"name":{"kind":"Name","value":"totalBeforeTax"},"arguments":[],"directives":[],"selectionSet":null}]}}]}}]}}]}}]}}],"loc":{"start":0,"end":3059}};
    doc.loc.source = {"body":"mutation updateItemQuantity($params: UpdateItemQuantityInput!, $withTax: Boolean, $withShipping: Boolean) {\n  cart {\n    updateItemQuantity(params: $params) {\n      errors {\n        code\n        commandName\n        message\n        field\n      }\n      cart {\n        cartId\n        storeId\n        buyerNote\n        items {\n          cartItemId\n          catalogAppId\n          convertedFormattedComparePrice\n          convertedFormattedPrice\n          convertedFormattedTotalPrice\n          convertedPrices {\n            comparePrice\n            formattedComparePrice\n            formattedPriceBeforeDiscount\n            formattedPrice\n            formattedTotalPrice\n            price\n            totalPrice\n          }\n          product {\n            comparePrice\n            convertedComparePrice\n            convertedPrice\n            customTextFields {\n              title\n              value\n            }\n            id\n            productType\n            urlPart\n            name\n            pageUrl\n            price\n            sku\n            weight\n            media(limit: 1) {\n              altText\n              mediaType\n              url\n              height\n              width\n            }\n            digitalProductFileItems {\n              fileType\n            }\n          }\n          optionsSelectionsValues {\n            id\n            title\n            value\n          }\n          convertedTotalPrice\n          freeText {\n            title\n            value\n          }\n          sku\n          quantity\n          inventoryQuantity\n          formattedComparePrice\n          formattedPriceBeforeDiscount\n          formattedPrice\n          formattedTotalPrice\n          subscriptionPlan {\n            id\n            name\n            tagline\n            frequency\n            duration\n          }\n          totalPrice\n          discountRules {\n            name\n          }\n        }\n        totals(withTax: $withTax, withShipping: $withShipping) {\n          subTotal\n          shipping\n          tax\n          total\n          discount\n          shippingWithoutTax\n          giftCardAmount\n          formattedSubTotal\n          formattedShipping\n          formattedTax\n          originalTotal\n          itemsTotal\n          formattedItemsTotal\n          formattedOriginalTotal\n          formattedTotalBeforeTax\n          formattedTotal\n          formattedDiscount\n          formattedShippingWithoutTax\n          formattedGiftCardAmount\n          totalBeforeTax\n        }\n        convertedTotals {\n          discount\n          formattedDiscount\n          formattedGiftCardAmount\n          formattedItemsTotal\n          formattedOriginalTotal\n          formattedShipping\n          formattedShippingWithoutTax\n          formattedSubTotal\n          formattedTax\n          formattedTotal\n          formattedTotalBeforeTax\n          giftCardAmount\n          itemsTotal\n          originalTotal\n          shipping\n          shippingWithoutTax\n          subTotal\n          tax\n          total\n          totalBeforeTax\n        }\n      }\n    }\n  }\n}\n","name":"GraphQL"};
  

    var names = {};
    function unique(defs) {
      return defs.filter(
        function(def) {
          if (def.kind !== 'FragmentDefinition') return true;
          var name = def.name.value
          if (names[name]) {
            return false;
          } else {
            names[name] = true;
            return true;
          }
        }
      )
    }
  

    // Collect any fragment/type references from a node, adding them to the refs Set
    function collectFragmentReferences(node, refs) {
      if (node.kind === "FragmentSpread") {
        refs.add(node.name.value);
      } else if (node.kind === "VariableDefinition") {
        var type = node.type;
        if (type.kind === "NamedType") {
          refs.add(type.name.value);
        }
      }

      if (node.selectionSet) {
        node.selectionSet.selections.forEach(function(selection) {
          collectFragmentReferences(selection, refs);
        });
      }

      if (node.variableDefinitions) {
        node.variableDefinitions.forEach(function(def) {
          collectFragmentReferences(def, refs);
        });
      }

      if (node.definitions) {
        node.definitions.forEach(function(def) {
          collectFragmentReferences(def, refs);
        });
      }
    }

    var definitionRefs = {};
    (function extractReferences() {
      doc.definitions.forEach(function(def) {
        if (def.name) {
          var refs = new Set();
          collectFragmentReferences(def, refs);
          definitionRefs[def.name.value] = refs;
        }
      });
    })();

    function findOperation(doc, name) {
      for (var i = 0; i < doc.definitions.length; i++) {
        var element = doc.definitions[i];
        if (element.name && element.name.value == name) {
          return element;
        }
      }
    }

    function oneQuery(doc, operationName) {
      // Copy the DocumentNode, but clear out the definitions
      var newDoc = {
        kind: doc.kind,
        definitions: [findOperation(doc, operationName)]
      };
      if (doc.hasOwnProperty("loc")) {
        newDoc.loc = doc.loc;
      }

      // Now, for the operation we're running, find any fragments referenced by
      // it or the fragments it references
      var opRefs = definitionRefs[operationName] || new Set();
      var allRefs = new Set();
      var newRefs = new Set();

      // IE 11 doesn't support "new Set(iterable)", so we add the members of opRefs to newRefs one by one
      opRefs.forEach(function(refName) {
        newRefs.add(refName);
      });

      while (newRefs.size > 0) {
        var prevRefs = newRefs;
        newRefs = new Set();

        prevRefs.forEach(function(refName) {
          if (!allRefs.has(refName)) {
            allRefs.add(refName);
            var childRefs = definitionRefs[refName] || new Set();
            childRefs.forEach(function(childRef) {
              newRefs.add(childRef);
            });
          }
        });
      }

      allRefs.forEach(function(refName) {
        var op = findOperation(doc, refName);
        if (op) {
          newDoc.definitions.push(op);
        }
      });

      return newDoc;
    }

    module.exports = doc;
    
        module.exports["updateItemQuantity"] = oneQuery(doc, "updateItemQuantity");
        


/***/ }),
/* 34 */
/*!*******************!*\
  !*** ./common.ts ***!
  \*******************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.common = exports.onInstanceChangeListener = void 0;
var angular = __webpack_require__(/*! angular */ 1);
var focusOn_1 = __webpack_require__(/*! ./directives/focusOn */ 2);
var visualFocusOn_1 = __webpack_require__(/*! ./directives/visualFocusOn/visualFocusOn */ 3);
__webpack_require__(/*! ng-debounce/dist/ng-debounce.js */ 4);
var sdkEvents_1 = __webpack_require__(/*! ./services/sdkEvents */ 5);
var sdkSettings_1 = __webpack_require__(/*! ./services/sdkSettings */ 6);
var appClientService_1 = __webpack_require__(/*! ./services/appClientService */ 8);
var settingsManager_1 = __webpack_require__(/*! ./services/settingsManager */ 9);
var cartStorage_1 = __webpack_require__(/*! ./services/cartStorage */ 10);
function onInstanceChangeListener(cb) {
    window.Wix.addEventListener(window.Wix.Events.INSTANCE_CHANGED, function (response) {
        return cb(response.instance);
    });
}
exports.onInstanceChangeListener = onInstanceChangeListener;
exports.common = angular
    .module('common', ['eComSFSMCommon', 'debounce'])
    .config(["HttpFacadeProvider", function (HttpFacadeProvider) {
    HttpFacadeProvider.setOnInstanceUpdate(onInstanceChangeListener);
}])
    .service('cartStorage', cartStorage_1.CartStorage)
    .constant('MULTILINGUAL_LANGUAGE', window.__MULTILINGUAL_LANGUAGE__)
    .directive('focusOn', focusOn_1.focusOn)
    .directive('visualFocusOn', visualFocusOn_1.visualFocusOn)
    .factory('focus', focusOn_1.focus)
    .service('sdkSettings', sdkSettings_1.SdkSettings)
    .service('sdkEvents', sdkEvents_1.SdkEvents)
    .service('appClientService', appClientService_1.appClientService)
    .service('settingsManager', settingsManager_1.SettingsManager).name;


/***/ }),
/* 35 */
/*!**************************************************!*\
  !*** ../node_modules/strict-uri-encode/index.js ***!
  \**************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function (str) {
	return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
		return '%' + c.charCodeAt(0).toString(16).toUpperCase();
	});
};


/***/ }),
/* 36 */
/*!**********************************************!*\
  !*** ../node_modules/object-assign/index.js ***!
  \**********************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),
/* 37 */
/*!*****************************************************!*\
  !*** ../node_modules/decode-uri-component/index.js ***!
  \*****************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var token = '%[a-f0-9]{2}';
var singleMatcher = new RegExp('(' + token + ')|([^%]+?)', 'gi');
var multiMatcher = new RegExp('(' + token + ')+', 'gi');

function decodeComponents(components, split) {
	try {
		// Try to decode the entire string first
		return [decodeURIComponent(components.join(''))];
	} catch (err) {
		// Do nothing
	}

	if (components.length === 1) {
		return components;
	}

	split = split || 1;

	// Split the array in 2 parts
	var left = components.slice(0, split);
	var right = components.slice(split);

	return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
}

function decode(input) {
	try {
		return decodeURIComponent(input);
	} catch (err) {
		var tokens = input.match(singleMatcher) || [];

		for (var i = 1; i < tokens.length; i++) {
			input = decodeComponents(tokens, i).join('');

			tokens = input.match(singleMatcher) || [];
		}

		return input;
	}
}

function customDecodeURIComponent(input) {
	// Keep track of all the replacements and prefill the map with the `BOM`
	var replaceMap = {
		'%FE%FF': '\uFFFD\uFFFD',
		'%FF%FE': '\uFFFD\uFFFD'
	};

	var match = multiMatcher.exec(input);
	while (match) {
		try {
			// Decode as big chunks as possible
			replaceMap[match[0]] = decodeURIComponent(match[0]);
		} catch (err) {
			var result = decode(match[0]);

			if (result !== match[0]) {
				replaceMap[match[0]] = result;
			}
		}

		match = multiMatcher.exec(input);
	}

	// Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else
	replaceMap['%C2'] = '\uFFFD';

	var entries = Object.keys(replaceMap);

	for (var i = 0; i < entries.length; i++) {
		// Replace all decoded components
		var key = entries[i];
		input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
	}

	return input;
}

module.exports = function (encodedURI) {
	if (typeof encodedURI !== 'string') {
		throw new TypeError('Expected `encodedURI` to be of type `string`, got `' + typeof encodedURI + '`');
	}

	try {
		encodedURI = encodedURI.replace(/\+/g, ' ');

		// Try the built in decoder first
		return decodeURIComponent(encodedURI);
	} catch (err) {
		// Fallback to a more advanced decoder
		return customDecodeURIComponent(encodedURI);
	}
};


/***/ }),
/* 38 */
/*!***********************************************!*\
  !*** ../node_modules/uuid/lib/rng-browser.js ***!
  \***********************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection

// getRandomValues needs to be invoked in a context where "this" is a Crypto
// implementation. Also, find the complete implementation of crypto on IE11.
var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
                      (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));

if (getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

  module.exports = function whatwgRNG() {
    getRandomValues(rnds8);
    return rnds8;
  };
} else {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);

  module.exports = function mathRNG() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}


/***/ }),
/* 39 */
/*!***********************************************!*\
  !*** ../node_modules/uuid/lib/bytesToUuid.js ***!
  \***********************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
  return ([
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]]
  ]).join('');
}

module.exports = bytesToUuid;


/***/ }),
/* 40 */
/*!*************************************************!*\
  !*** ../node_modules/webpack/buildin/global.js ***!
  \*************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 41 */
/*!***************************************************************************!*\
  !*** ../node_modules/@wix/js-sdk-wrapper/node_modules/tslib/tslib.es6.js ***!
  \***************************************************************************/
/*! exports provided: __extends, __assign, __rest, __decorate, __param, __metadata, __awaiter, __generator, __createBinding, __exportStar, __values, __read, __spread, __spreadArrays, __await, __asyncGenerator, __asyncDelegator, __asyncValues, __makeTemplateObject, __importStar, __importDefault, __classPrivateFieldGet, __classPrivateFieldSet */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is referenced from these modules with unsupported syntax: ../node_modules/@wix/js-sdk-wrapper/dist/src/create-wix-sdk-wrapper.js (referenced with cjs require) */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__extends", function() { return __extends; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__assign", function() { return __assign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__rest", function() { return __rest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__decorate", function() { return __decorate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__param", function() { return __param; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__metadata", function() { return __metadata; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__awaiter", function() { return __awaiter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__generator", function() { return __generator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__createBinding", function() { return __createBinding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__exportStar", function() { return __exportStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__values", function() { return __values; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__read", function() { return __read; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spread", function() { return __spread; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spreadArrays", function() { return __spreadArrays; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__await", function() { return __await; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncGenerator", function() { return __asyncGenerator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncDelegator", function() { return __asyncDelegator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncValues", function() { return __asyncValues; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__makeTemplateObject", function() { return __makeTemplateObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importStar", function() { return __importStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importDefault", function() { return __importDefault; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__classPrivateFieldGet", function() { return __classPrivateFieldGet; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__classPrivateFieldSet", function() { return __classPrivateFieldSet; });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __createBinding(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}

function __exportStar(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}


/***/ }),
/* 42 */
/*!*************************************************************!*\
  !*** ../node_modules/@wix/js-sdk-wrapper/dist/src/utils.js ***!
  \*************************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.createSafeCall = exports.addTimeout = void 0;
function addTimeout(promise, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.timeout, timeout = _c === void 0 ? 2 * 60 * 1000 : _c, _d = _b.message, message = _d === void 0 ? 'Timeout: Wix Js Sdk' : _d;
    var error;
    try {
        throw new Error(message); // to capture stack trace for IE
    }
    catch (ex) {
        error = ex;
    }
    var timerId;
    var timeoutPromise = new Promise(function (resolve, reject) {
        timerId = setTimeout(reject, timeout, error);
    });
    var clear = function () { return clearTimeout(timerId); };
    promise.then(clear, clear);
    return Promise.race([promise, timeoutPromise]);
}
exports.addTimeout = addTimeout;
function createSafeCall(onError) {
    return function (fn) {
        return function () {
            try {
                return fn.apply(this, arguments); //tslint:disable-line:no-invalid-this
            }
            catch (ex) {
                onError(ex);
                return null;
            }
        };
    };
}
exports.createSafeCall = createSafeCall;
//# sourceMappingURL=utils.js.map

/***/ }),
/* 43 */
/*!********************************************!*\
  !*** ./multilingual/getLocaleNamespace.ts ***!
  \********************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocaleNamespace = exports.MULTILINGUAL_NAMESPACE = void 0;
exports.MULTILINGUAL_NAMESPACE = 'multilingual';
function getLocaleNamespace(locale) {
    return "".concat(exports.MULTILINGUAL_NAMESPACE, "_").concat(locale);
}
exports.getLocaleNamespace = getLocaleNamespace;


/***/ }),
/* 44 */
/*!**********************************************************************************!*\
  !*** ../node_modules/@wix/app-settings-client/dist/es/src/index.js + 10 modules ***!
  \**********************************************************************************/
/*! exports provided: settingsClient, appClient, adapters, SettingsClient, AppClient, JsSdkAdapter, Scope */
/*! all exports used */
/*! ModuleConcatenation bailout: Cannot concat with ../node_modules/@wix/js-sdk-wrapper/dist/src/create-wix-sdk-wrapper.js (<- Module is not an ECMAScript module) */
/*! ModuleConcatenation bailout: Cannot concat with ../node_modules/query-string/index.js (<- Module is not an ECMAScript module) */
/*! ModuleConcatenation bailout: Cannot concat with ../node_modules/tslib/tslib.es6.js (<- Module is referenced from these modules with unsupported syntax: ../node_modules/@wix/wixstores-client-core/dist/src/common/cart-services/cart-services.js (referenced with cjs require)) */
/*! ModuleConcatenation bailout: Cannot concat with ../node_modules/uuid/v4.js (<- Module is not an ECMAScript module) */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "settingsClient", function() { return /* binding */ settingsClient; });
__webpack_require__.d(__webpack_exports__, "appClient", function() { return /* binding */ appClient; });
__webpack_require__.d(__webpack_exports__, "adapters", function() { return /* binding */ adapters; });
__webpack_require__.d(__webpack_exports__, "SettingsClient", function() { return /* reexport */ settings_client_SettingsClient; });
__webpack_require__.d(__webpack_exports__, "AppClient", function() { return /* reexport */ app_client_AppClient; });
__webpack_require__.d(__webpack_exports__, "JsSdkAdapter", function() { return /* reexport */ js_sdk_adapter_JsSdkAdapter; });
__webpack_require__.d(__webpack_exports__, "Scope", function() { return /* reexport */ Scope; });

// EXTERNAL MODULE: ../node_modules/query-string/index.js
var query_string = __webpack_require__(11);

// EXTERNAL MODULE: ../node_modules/tslib/tslib.es6.js
var tslib_es6 = __webpack_require__(0);

// EXTERNAL MODULE: ../node_modules/uuid/v4.js
var v4 = __webpack_require__(12);
var v4_default = /*#__PURE__*/__webpack_require__.n(v4);

// CONCATENATED MODULE: ../node_modules/@wix/app-settings-client/dist/es/src/utils/generate-id.js

function generate() {
    return v4_default()();
}
/* harmony default export */ var generate_id = (generate);
//# sourceMappingURL=generate-id.js.map
// CONCATENATED MODULE: ../node_modules/@wix/app-settings-client/dist/es/src/utils/delay.js
function delay(timeout) {
    return new Promise(function (resolve) {
        setTimeout(resolve, timeout);
    });
}
//# sourceMappingURL=delay.js.map
// CONCATENATED MODULE: ../node_modules/@wix/app-settings-client/dist/es/src/errors.js

var errors_HttpError = /** @class */ (function (_super) {
    Object(tslib_es6["__extends"])(HttpError, _super);
    function HttpError(url, statusCode) {
        var _this = _super.call(this, "request to ".concat(url, " failed, status code is ").concat(statusCode)) || this;
        _this.url = url;
        _this.statusCode = statusCode;
        Object.setPrototypeOf(_this, HttpError.prototype);
        return _this;
    }
    return HttpError;
}(Error));

//# sourceMappingURL=errors.js.map
// CONCATENATED MODULE: ../node_modules/@wix/app-settings-client/dist/es/src/settings-client.js




var settings_client_SettingsClient = /** @class */ (function () {
    function SettingsClient(_a) {
        var apiClient = _a.apiClient, scope = _a.scope, adapter = _a.adapter, data = _a.data, _b = _a.generateId, generateId = _b === void 0 ? generate_id : _b, _c = _a.wait, wait = _c === void 0 ? delay : _c;
        this.firstTime = true;
        this.apiClient = apiClient;
        this.scope = scope;
        this.adapter = adapter;
        this.data = data;
        this.generateId = generateId;
        this.instance = adapter.signedInstance;
        this.queue = [];
        this.wait = wait;
    }
    SettingsClient.prototype.getAll = function () {
        return Object(tslib_es6["__awaiter"])(this, void 0, void 0, function () {
            return Object(tslib_es6["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SettingsClient.prototype.get = function (key) {
        return Object(tslib_es6["__awaiter"])(this, void 0, void 0, function () {
            return Object(tslib_es6["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadData()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, key ? this.data[key] : this.data];
                }
            });
        });
    };
    SettingsClient.prototype.set = function (key, value) {
        return Object(tslib_es6["__awaiter"])(this, void 0, void 0, function () {
            return Object(tslib_es6["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadData()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.update(key, value)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SettingsClient.prototype.delete = function (key) {
        return Object(tslib_es6["__awaiter"])(this, void 0, void 0, function () {
            return Object(tslib_es6["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadData()];
                    case 1:
                        _a.sent();
                        if (!this.data.hasOwnProperty(key)) {
                            throw new Error("'".concat(key, "' doesn't exist in settings"));
                        }
                        return [4 /*yield*/, this.update(key, null)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SettingsClient.prototype.loadData = function () {
        return Object(tslib_es6["__awaiter"])(this, void 0, void 0, function () {
            var e_1;
            return Object(tslib_es6["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.getPromise) {
                            this.getPromise = this.resolveData();
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.getPromise];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        this.getPromise = null;
                        throw e_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SettingsClient.prototype.resolveData = function () {
        return Object(tslib_es6["__awaiter"])(this, void 0, void 0, function () {
            var externalId, _a, e_2;
            return Object(tslib_es6["__generator"])(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getExternalId()];
                    case 1:
                        externalId = _b.sent();
                        if (!(!this.data && externalId)) return [3 /*break*/, 6];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        _a = this;
                        return [4 /*yield*/, this.apiClient.get(this.instance, externalId, this.scope)];
                    case 3:
                        _a.data = _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_2 = _b.sent();
                        // there was an issue that we saved external id although
                        // the actual data was not saved in our db.
                        // it means that there're users with external id
                        // that this apiClient.get call would fail with 404
                        if (e_2 instanceof errors_HttpError && e_2.statusCode === 404) {
                            this.firstTime = true;
                            this.data = {};
                            return [2 /*return*/];
                        }
                        throw e_2;
                    case 5:
                        this.firstTime = false;
                        return [3 /*break*/, 7];
                    case 6:
                        if (!this.data) {
                            this.data = {};
                        }
                        _b.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    SettingsClient.prototype.update = function (key, value) {
        return Object(tslib_es6["__awaiter"])(this, void 0, void 0, function () {
            return Object(tslib_es6["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.data[key] = value;
                        this.adapter.triggerSettingsUpdated(this.data, this.scope);
                        this.queue.push({ key: key, value: value });
                        if (!this.flushPromise) {
                            this.flushPromise = this.flushQueue();
                        }
                        return [4 /*yield*/, this.flushPromise];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SettingsClient.prototype.flushQueue = function () {
        return Object(tslib_es6["__awaiter"])(this, void 0, void 0, function () {
            var queue;
            return Object(tslib_es6["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.wait(100)];
                    case 1:
                        _a.sent();
                        queue = this.queue.slice();
                        this.queue = [];
                        this.flushPromise = null;
                        return [4 /*yield*/, this.saveChanges(queue)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SettingsClient.prototype.saveChanges = function (queue) {
        return Object(tslib_es6["__awaiter"])(this, void 0, void 0, function () {
            var changes, newExternalId, newExternalId;
            return Object(tslib_es6["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        changes = queue.reduce(function (acc, item) {
                            acc[item.key] = item.value;
                            return acc;
                        }, {});
                        if (!this.firstTime) return [3 /*break*/, 3];
                        newExternalId = this.generateId();
                        return [4 /*yield*/, this.apiClient.set(this.instance, newExternalId, this.scope, changes)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.setExternalId(newExternalId)];
                    case 2:
                        _a.sent();
                        this.firstTime = false;
                        return [3 /*break*/, 6];
                    case 3: return [4 /*yield*/, this.apiClient.update(this.instance, this.externalId, this.scope, changes)];
                    case 4:
                        newExternalId = _a.sent();
                        return [4 /*yield*/, this.setExternalId(newExternalId)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    SettingsClient.prototype.setExternalId = function (externalId) {
        return Object(tslib_es6["__awaiter"])(this, void 0, void 0, function () {
            return Object(tslib_es6["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.adapter.setExternalId(externalId)];
                    case 1:
                        _a.sent();
                        this.externalId = externalId;
                        return [2 /*return*/];
                }
            });
        });
    };
    SettingsClient.prototype.getExternalId = function () {
        return Object(tslib_es6["__awaiter"])(this, void 0, void 0, function () {
            var _a;
            return Object(tslib_es6["__generator"])(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.externalId) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.adapter.getExternalId()];
                    case 1:
                        _a.externalId = _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/, this.externalId];
                }
            });
        });
    };
    return SettingsClient;
}());

//# sourceMappingURL=settings-client.js.map
// CONCATENATED MODULE: ../node_modules/@wix/app-settings-client/dist/es/src/app-client.js

var app_client_AppClient = /** @class */ (function () {
    function AppClient(_a) {
        var adapter = _a.adapter, scope = _a.scope, cdnClient = _a.cdnClient, data = _a.data;
        var _this = this;
        this.adapter = adapter;
        this.scope = scope;
        this.cdnClient = cdnClient;
        this.data = data;
        this.listeners = [];
        //TODO: what happens if data is not loaded?
        this.adapter.onSettingsUpdated(scope, function (data) {
            _this.data = data;
            _this.listeners.forEach(function (l) { return l(_this.data); });
        });
    }
    AppClient.prototype.getAll = function () {
        return Object(tslib_es6["__awaiter"])(this, void 0, void 0, function () {
            return Object(tslib_es6["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AppClient.prototype.get = function (key) {
        return Object(tslib_es6["__awaiter"])(this, void 0, void 0, function () {
            return Object(tslib_es6["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadData()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, key ? this.data[key] : this.data];
                }
            });
        });
    };
    AppClient.prototype.onChange = function (cb) {
        this.listeners.push(cb);
    };
    AppClient.prototype.loadData = function () {
        return Object(tslib_es6["__awaiter"])(this, void 0, void 0, function () {
            return Object(tslib_es6["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.getPromise) {
                            this.getPromise = this.resolveData();
                        }
                        return [4 /*yield*/, this.getPromise];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AppClient.prototype.resolveData = function () {
        return Object(tslib_es6["__awaiter"])(this, void 0, void 0, function () {
            var _a, _b;
            return Object(tslib_es6["__generator"])(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.getExternalId()];
                    case 1:
                        _a.externalId = _c.sent();
                        if (!(!this.data && this.externalId)) return [3 /*break*/, 3];
                        _b = this;
                        return [4 /*yield*/, this.cdnClient.get(this.adapter.getAppDefId(), this.adapter.getInstanceId(), this.externalId, this.scope)];
                    case 2:
                        _b.data = _c.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        if (!this.data) {
                            this.data = {};
                        }
                        _c.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AppClient.prototype.getExternalId = function () {
        return Object(tslib_es6["__awaiter"])(this, void 0, void 0, function () {
            var _a;
            return Object(tslib_es6["__generator"])(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.externalId;
                        if (_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.adapter.getExternalId()];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2: return [2 /*return*/, _a];
                }
            });
        });
    };
    return AppClient;
}());

//# sourceMappingURL=app-client.js.map
// EXTERNAL MODULE: ../node_modules/@wix/js-sdk-wrapper/dist/src/create-wix-sdk-wrapper.js
var create_wix_sdk_wrapper = __webpack_require__(13);

// CONCATENATED MODULE: ../node_modules/@wix/app-settings-client/dist/es/src/js-sdk-adapter.js


var js_sdk_adapter_JsSdkAdapter = /** @class */ (function () {
    function JsSdkAdapter(_a) {
        var jsSdkInstance = _a.jsSdkInstance, signedInstance = _a.signedInstance;
        this.jsSdkWrapper = Object(create_wix_sdk_wrapper["wixSdk"])(jsSdkInstance);
        this.originalJsSdk = jsSdkInstance;
        this.signedInstance = signedInstance;
    }
    JsSdkAdapter.prototype.getAppDefId = function () {
        return this.jsSdkWrapper.Utils.getInstanceValue('appDefId');
    };
    JsSdkAdapter.prototype.getInstanceId = function () {
        var metaSiteId = this.jsSdkWrapper.Utils.getInstanceValue('metaSiteId');
        var originInstanceId = this.jsSdkWrapper.Utils.getInstanceValue('originInstanceId');
        // pre-save mode; ex: when editing a template, the instanceId is not persisted YET,
        // so data does not exists for that instanceId. Hence, we need to take the data that is saved
        // on the template (originInstanceId).
        if (!metaSiteId && originInstanceId) {
            return originInstanceId;
        }
        else {
            return this.jsSdkWrapper.Utils.getInstanceId();
        }
    };
    JsSdkAdapter.prototype.getExternalId = function () {
        return Object(tslib_es6["__awaiter"])(this, void 0, void 0, function () {
            return Object(tslib_es6["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.jsSdkWrapper.getExternalId()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    JsSdkAdapter.prototype.setExternalId = function (id) {
        return Object(tslib_es6["__awaiter"])(this, void 0, void 0, function () {
            var _this = this;
            return Object(tslib_es6["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    //TODO: once js-sdk version released update signature in js-sdk-wrapper
                    return [4 /*yield*/, new Promise(function (resolve, reject) { return _this.originalJsSdk.Settings.setExternalId(id, resolve, reject, true); })];
                    case 1:
                        //TODO: once js-sdk version released update signature in js-sdk-wrapper
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    JsSdkAdapter.prototype.triggerSettingsUpdated = function (data, scope) {
        var message = {
            scope: scope,
            payload: data,
            source: 'app-settings'
        };
        this.jsSdkWrapper.Settings.triggerSettingsUpdatedEvent(message, this.jsSdkWrapper.Utils.getOrigCompId());
    };
    JsSdkAdapter.prototype.onSettingsUpdated = function (scope, cb) {
        this.jsSdkWrapper.addEventListener('SETTINGS_UPDATED', function (data) {
            if (data && data.source === 'app-settings' && data.scope === scope) {
                cb(data.payload);
            }
        });
    };
    return JsSdkAdapter;
}());

//# sourceMappingURL=js-sdk-adapter.js.map
// CONCATENATED MODULE: ../node_modules/@wix/app-settings-client/dist/es/src/domain.js
var Scope;
(function (Scope) {
    Scope["APP"] = "APP";
    Scope["COMPONENT"] = "COMPONENT";
})(Scope || (Scope = {}));
//# sourceMappingURL=domain.js.map
// CONCATENATED MODULE: ../node_modules/@wix/app-settings-client/dist/es/src/http-api-client.js



var http_api_client_HttpApiClient = /** @class */ (function () {
    function HttpApiClient(apiUrl) {
        this.apiUrl = apiUrl.replace(/\/$/, '');
    }
    HttpApiClient.prototype.get = function (signedInstance, externalId, scope) {
        return Object(tslib_es6["__awaiter"])(this, void 0, void 0, function () {
            var url, json;
            return Object(tslib_es6["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.apiUrl, "/v1/settings?external_").concat(scope.toLowerCase(), "_id=").concat(externalId);
                        return [4 /*yield*/, this.requestJson({ signedInstance: signedInstance, url: url, method: 'GET' })];
                    case 1:
                        json = _a.sent();
                        return [2 /*return*/, scope === Scope.APP ? json.appSettings : json.componentSettings];
                }
            });
        });
    };
    HttpApiClient.prototype.set = function (signedInstance, externalId, scope, data) {
        return Object(tslib_es6["__awaiter"])(this, void 0, void 0, function () {
            var url;
            return Object(tslib_es6["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.apiUrl, "/v1/settings/").concat(scope, "/").concat(externalId);
                        return [4 /*yield*/, this.requestJson({ signedInstance: signedInstance, url: url, requestBody: { data: data }, method: 'PUT' })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    HttpApiClient.prototype.update = function (signedInstance, externalId, scope, data) {
        return Object(tslib_es6["__awaiter"])(this, void 0, void 0, function () {
            var url, _a, fields, sanitizedData, requestBody, newExternalId;
            return Object(tslib_es6["__generator"])(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        url = "".concat(this.apiUrl, "/v1/settings/").concat(scope, "/").concat(externalId);
                        _a = buildForUpdate(data), fields = _a.fields, sanitizedData = _a.sanitizedData;
                        requestBody = { data: sanitizedData, fields: fields };
                        return [4 /*yield*/, this.requestJson({ signedInstance: signedInstance, url: url, requestBody: requestBody, method: 'PATCH' })];
                    case 1:
                        newExternalId = (_b.sent()).newExternalId;
                        return [2 /*return*/, newExternalId];
                }
            });
        });
    };
    HttpApiClient.prototype.requestJson = function (_a) {
        var signedInstance = _a.signedInstance, _b = _a.method, method = _b === void 0 ? 'GET' : _b, requestBody = _a.requestBody, url = _a.url;
        return Object(tslib_es6["__awaiter"])(this, void 0, void 0, function () {
            var additionalHeaders, response;
            return Object(tslib_es6["__generator"])(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        additionalHeaders = signedInstance ? { Authorization: signedInstance } : {};
                        return [4 /*yield*/, fetch(url, {
                                method: method,
                                body: JSON.stringify(requestBody),
                                headers: Object(tslib_es6["__assign"])({ 'Content-Type': 'application/json' }, additionalHeaders)
                            })];
                    case 1:
                        response = _c.sent();
                        if (!response.ok) {
                            throw new errors_HttpError(url, response.status);
                        }
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _c.sent()];
                }
            });
        });
    };
    return HttpApiClient;
}());
function buildForUpdate(data) {
    var cloned = Object(tslib_es6["__assign"])({}, data);
    var fields = Object.keys(cloned);
    Object.keys(cloned).forEach(function (key) {
        (cloned[key] === null || cloned[key] === undefined) && delete cloned[key];
    });
    return { fields: fields, sanitizedData: cloned };
}

//# sourceMappingURL=http-api-client.js.map
// CONCATENATED MODULE: ../node_modules/@wix/app-settings-client/dist/es/src/utils/checks.js
function assert(expr, message) {
    if (!Boolean(expr)) {
        throw new Error(message);
    }
}
function resolve(primary, backup, message) {
    var result = primary || backup();
    assert(result !== undefined, message);
    return result;
}

//# sourceMappingURL=checks.js.map
// CONCATENATED MODULE: ../node_modules/@wix/app-settings-client/dist/es/src/cdn-api-client.js

var cdn_api_client_CdnApiClient = /** @class */ (function () {
    function CdnApiClient(opts) {
        this.cdnUrl = (opts.baseCdnUrl || 'https://settings.parastorage.com/').replace(/\/$/, '');
        this.fetch = opts.fetch || (function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return fetch.apply(void 0, args);
        }); // https://stackoverflow.com/a/72800505
    }
    CdnApiClient.prototype.get = function (appDefId, instanceId, externalId, scope) {
        return Object(tslib_es6["__awaiter"])(this, void 0, void 0, function () {
            var url, response;
            return Object(tslib_es6["__generator"])(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.cdnUrl, "/v1/settings/").concat(appDefId, "/").concat(instanceId, "/").concat(scope, "/").concat(externalId);
                        return [4 /*yield*/, this.fetch(url, {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return CdnApiClient;
}());

//# sourceMappingURL=cdn-api-client.js.map
// CONCATENATED MODULE: ../node_modules/@wix/app-settings-client/dist/es/src/index.js








function settingsClient(opts) {
    assertClientInput(opts);
    var scope = opts.scope, data = opts.data;
    var adapter = opts.adapter || adapters.wixSdk();
    var settingsApiUrl = resolve(opts.apiUrl, getApiUrl, 'could not resolve apiUrl - please provide it explicitly');
    return new settings_client_SettingsClient({
        adapter: adapter,
        scope: scope,
        data: data,
        apiClient: new http_api_client_HttpApiClient(settingsApiUrl)
    });
}
function appClient(opts) {
    assertClientInput(opts);
    var scope = opts.scope, data = opts.data;
    var adapter = opts.adapter || adapters.wixSdk();
    var settingsApiUrl = opts.cdnUrl;
    return new app_client_AppClient({
        adapter: adapter,
        scope: scope,
        data: data,
        cdnClient: new cdn_api_client_CdnApiClient({ baseCdnUrl: settingsApiUrl })
    });
}
var adapters = {
    wixSdk: function (_a) {
        var _b = _a === void 0 ? {} : _a, jsSdkInstance = _b.jsSdkInstance, signedInstance = _b.signedInstance;
        return new js_sdk_adapter_JsSdkAdapter({
            jsSdkInstance: resolve(jsSdkInstance, getWixSdk, 'window.Wix is undefined, please specify jsSdkInstance'),
            signedInstance: resolve(signedInstance, getInstance, 'no instance in query parameters, please specify signedInstance'),
        });
    }
};
function assertClientInput(opts) {
    assert(opts !== undefined, 'opts is mandatory');
    assert(opts.scope !== undefined, 'scope is mandatory');
    assert(opts.scope === Scope.COMPONENT || opts.scope === Scope.APP, 'scope must be APP or COMPONENT');
    assert(opts.scope === Scope.COMPONENT, 'APP scope is not supported');
}
function getWixSdk() {
    return window.Wix;
}
function getInstance() {
    return Object(query_string["parse"])(window.location.search).instance;
}
function getApiUrl() {
    return "".concat(window.location.origin, "/_api/app-settings-service");
}

//# sourceMappingURL=index.js.map

/***/ })
/******/ ]);
//# sourceMappingURL=app.bundle.js.map

/*** EXPORTS FROM exports-loader ***/
if (!window["Scope"]) {window["Scope"] = {}};for (prop in Scope) {if (Scope.hasOwnProperty(prop)) {window["Scope"][prop] = Scope[prop]}};