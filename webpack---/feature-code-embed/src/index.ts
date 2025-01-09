import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { CodeEmbed } from './codeEmbed'
import { LifeCycle } from '@wix/thunderbolt-symbols'

export const site: ContainerModuleLoader = (bind) => {
	if (process.env.browser) {
		bind(LifeCycle.AppWillLoadPageHandler).to(CodeEmbed)
	}
}
