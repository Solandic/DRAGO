"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const JupiterLogo = ({ width = 24, height = 24 }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return (0, jsx_runtime_1.jsx)("img", { src: 'https://jup.ag/svg/jupiter-logo.svg', width: width, height: height, alt: "Jupiter aggregator" });
};
exports.default = JupiterLogo;
