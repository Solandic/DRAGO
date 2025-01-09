import type { ImagePlaceholder, ImagePlaceholderData, ImagePlaceholderPageConfig } from './types'
import { IComponentPropsExtender } from 'feature-components'
import { IMAGE_PLACEHOLDER_COMPONENTS_TYPES } from './imagePlaceholderComponentTypes'
import { IPageWillMountHandler } from '@wix/thunderbolt-symbols'
import { createPlaceholderGetter } from '@wix/image-placeholder'

export default function createFactory(getImageClientApi: any) {
	return (
		pageConfig: ImagePlaceholderPageConfig
	): IComponentPropsExtender<
		{ getPlaceholder: (imagePlaceholderData: ImagePlaceholderData) => ImagePlaceholder },
		unknown
	> &
		IPageWillMountHandler => {
		const { isSEOBot, staticMediaUrl } = pageConfig

		const { getPlaceholder } = createPlaceholderGetter(getImageClientApi().getPlaceholder, {
			baseMediaUrl: staticMediaUrl,
			isSEOBot,
		})

		return {
			componentTypes: IMAGE_PLACEHOLDER_COMPONENTS_TYPES,
			getExtendedProps: () => ({ getPlaceholder }),
			pageWillMount() {
				// since getPlaceHolder is using imageClientApi we need to wait for imageClientApi before rendering
				return window.externalsRegistry.imageClientApi.loaded
			},
			name: 'ClientImagePlaceholder',
		}
	}
}
