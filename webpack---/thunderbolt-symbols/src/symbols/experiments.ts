import { Experiments } from '../features/experiments'
import { createIdentifier } from '@wix/thunderbolt-ioc'

export const ExperimentsSymbol = createIdentifier<Experiments>(Symbol('ExperimentsSymbol'))
