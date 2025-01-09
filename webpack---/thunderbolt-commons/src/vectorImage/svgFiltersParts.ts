// /*eslint no-extra-parens:0*/
// 'use strict'

import { RGB } from './typing'

function getSepia(amount: number) {
	return `${0.393 + 0.607 * (1 - amount)} ${0.769 - 0.769 * (1 - amount)} ${0.189 - 0.189 * (1 - amount)} 0 0
     ${0.349 - 0.349 * (1 - amount)} ${0.686 + 0.314 * (1 - amount)} ${0.168 - 0.168 * (1 - amount)} 0 0
     ${0.272 - 0.272 * (1 - amount)} ${0.534 - 0.534 * (1 - amount)} ${0.131 + 0.869 * (1 - amount)} 0 0
     0 0 0 1 0`
}

function getContrast(amount: number) {
	return `<feFuncR type="linear" slope="${amount}" intercept="${Math.round((-0.5 * amount + 0.5) * 100) / 100}"/>
<feFuncG type="linear" slope="${amount}" intercept="${Math.round((-0.5 * amount + 0.5) * 100) / 100}"/>
<feFuncB type="linear" slope="${amount}" intercept="${Math.round((-0.5 * amount + 0.5) * 100) / 100}"/>`
}

function getBrightness(amount: number) {
	return `<feFuncR type="linear" slope="${amount}" /><feFuncG type="linear" slope="${amount}" /><feFuncB type="linear" slope="${amount}" />`
}

function getTint(color: RGB) {
	return `${1 - color.r} 0 0 0 ${color.r} ${1 - color.g} 0 0 0 ${color.g} ${1 - color.b} 0 0 0 ${color.b} 0 0 0 1 0`
}

function getLumaMatrix(whiteParams: RGB, blackParams: RGB) {
	return `${whiteParams.r} 0 0 0 ${blackParams.r}
     ${whiteParams.g} 1 0 0 ${blackParams.g}
     ${whiteParams.b} 0 1 0 ${blackParams.b}
     0 0 0 1 0`
}

function getColor(color: RGB, opacity = 1) {
	return `0 0 0 0 ${color.r}
0 0 0 0 ${color.g}
0 0 0 0 ${color.b}
0 0 0 ${opacity} 0`
}

/**
 * colors the source to 2 colors , input should be gray scale
 */
function getDoutone(light: RGB, dark: RGB) {
	const r_diff = light.r - dark.r
	const g_diff = light.g - dark.g
	const b_diff = light.b - dark.b

	return `${r_diff} 0 0 0 ${dark.r} ${g_diff} 0 0 0 ${dark.g} ${b_diff} 0 0 0 ${dark.b} 0 0 0 1 0`
}

function getAlpha(amount: number) {
	return `<feFuncA type="linear" slope="${amount}" />`
}

function hexToRgb(hex: string): RGB {
	const [, r, g, b] = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)! // fIXM<E
	return {
		r: parseInt(r, 16),
		g: parseInt(g, 16),
		b: parseInt(b, 16),
	}
}

function hex2RgbNorm(hex: string) {
	const { r, g, b } = hexToRgb(hex)
	return {
		r: r / 255,
		g: g / 255,
		b: b / 255,
	}
}

export {
	getDoutone,
	hexToRgb,
	hex2RgbNorm,
	getColor,
	getContrast,
	getSepia,
	getBrightness,
	getTint,
	getAlpha,
	getLumaMatrix,
}
