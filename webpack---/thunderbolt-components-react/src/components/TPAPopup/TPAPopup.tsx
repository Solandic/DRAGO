import React, { ComponentType } from 'react'
import style from './style/TPAPopup.scss'

export type TpaPopupProps = {
	id: string
	src: string
	isBareTheme: boolean
	closePopup: () => void
	options: any
	originCompId: string
	styleOverrides: any
	className: string
}

const TPAPopup: ComponentType<TpaPopupProps> = (props) => {
	const IFRAME_CROSS_DOMAIN_PERMISSIONS = ['autoplay', 'camera', 'microphone', 'geolocation', 'vr'].join(';')

	const { id, src, isBareTheme, styleOverrides, closePopup } = props || {}

	const getRootClassNames = () => {
		const rootClasses = [style.root, props.className]
		if (isBareTheme) {
			rootClasses.push(style.bare)
		}

		return rootClasses.join(' ')
	}

	return (
		<div id={id} className={getRootClassNames()} style={styleOverrides}>
			<div className={style.closeButton} onClick={() => closePopup()} />
			<iframe
				name={id}
				className={style.iframe}
				allowFullScreen={true}
				// @ts-ignore
				allowtransparency="true"
				allowvr="true"
				frameBorder="0"
				scrolling="no"
				src={src}
				title={id}
				aria-label={id}
				allow={IFRAME_CROSS_DOMAIN_PERMISSIONS}
			/>
		</div>
	)
}

export default TPAPopup
