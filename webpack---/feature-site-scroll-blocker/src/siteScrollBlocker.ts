import { createSiteScrollBlocker } from '@wix/site-scroll-blocker'

import { isSSR } from '@wix/thunderbolt-commons'
import { named, withDependencies } from '@wix/thunderbolt-ioc'
import {
	BrowserWindow,
	BrowserWindowSymbol,
	Experiments,
	ExperimentsSymbol,
	FeatureExportsSymbol,
} from '@wix/thunderbolt-symbols'
import { IFeatureExportsStore } from 'thunderbolt-feature-exports'
import { ISiteScrollBlocker } from './ISiteScrollBlocker'
import { name } from './index'

const isPublicSegment = process.env.PACKAGE_NAME !== 'thunderbolt-ds'

const siteScrollBlockerFactory = (
	window: BrowserWindow,
	siteScrollBlockerExports: IFeatureExportsStore<typeof name>,
	experiments: Experiments
): ISiteScrollBlocker => {
	const shouldBlockScrollWithoutVar = experiments['specs.thunderbolt.siteScrollBlockerWithoutVar'] && isPublicSegment
	const scrollBlocker = createSiteScrollBlocker({
		browserWindow: window as Window,
		isSSR,
		onSiteScrollBlockChanged: (status) => {
			siteScrollBlockerExports.export({
				isScrollingBlocked: status,
			})
		},
		shouldBlockScrollWithoutVar,
	})
	siteScrollBlockerExports.export({
		setSiteScrollingBlocked: scrollBlocker.setSiteScrollingBlocked,
		isScrollingBlocked: scrollBlocker.isScrollingBlocked(),
	})
	return scrollBlocker
}

export const SiteScrollBlocker = withDependencies(
	[BrowserWindowSymbol, named(FeatureExportsSymbol, name), ExperimentsSymbol],
	siteScrollBlockerFactory
)
