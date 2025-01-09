import { ScopeContext } from '@sentry/types'
import { withDependencies } from '@wix/thunderbolt-ioc'
import { Experiments, ExperimentsSymbol, ViewerModel, ViewerModelSym } from '@wix/thunderbolt-symbols'
import LazySentry from '../lazySentry'

export type Reporter = { reportError: (error: Error, dsn?: string, context?: Partial<ScopeContext>) => void }
export const OOIReporterSymbol = Symbol('OOIReporter')

export default withDependencies(
	[ViewerModelSym, ExperimentsSymbol],
	({ requestUrl: url }: ViewerModel, experiments: Experiments): Reporter => {
		return {
			reportError: (error, dsn?, context?) => {
				if (dsn) {
					const loadNewSentrySdk = experiments && experiments['specs.thunderbolt.loadNewerSentrySdk']
					const sentry = new LazySentry({ dsn }, [], loadNewSentrySdk)
					sentry.captureException(error, {
						captureContext: {
							...context,
							tags: {
								platform: 'true',
								isSSR: `${!process.env.browser}`,
								url,
								...context?.tags,
							},
						},
					})
				}
			},
		}
	}
)
