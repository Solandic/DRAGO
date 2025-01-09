import { CreateBiLoggerParams } from '../types'
import { ECOM_BI_ENDPOINT, ECOM_MODULE_NAME } from './constants'

export const createBiLogger = ({ biUtils, msid }: CreateBiLoggerParams) => {
	const biLoggerFactory = biUtils.createBaseBiLoggerFactory(ECOM_BI_ENDPOINT)
	const logger = biLoggerFactory.updateDefaults({ src: 130 }).logger()
	return {
		logFemCall(methodName: string, methodParams?: string) {
			logger.log({
				evid: 12,
				msid,
				methodName,
				moduleName: ECOM_MODULE_NAME,
				...(methodParams ? { methodParams } : {}),
			})
		},
	}
}
