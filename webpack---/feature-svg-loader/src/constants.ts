// list of components that will use the svg loader feature
const SVG_COMPONENTS = ['VectorImage', 'Breadcrumbs'] as const

const SVG_TYPES = {
	SHAPE: 'shape',
	TINT: 'tint',
	COLOR: 'color',
	UGC: 'ugc',
} as const

export { SVG_COMPONENTS, SVG_TYPES }
