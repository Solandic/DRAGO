import {
  PlatformServicesAPI,
  WixCodeAPI,
} from '@wix/blocks-widget-services-types';
import type WixExperiments from '@wix/wix-experiments';
import type { ExperimentsBag } from '@wix/wix-experiments';
import { ILogger } from './ILogger';

const EXPERIMENTS_OVERRIDE_URL_PARAM = 'experiments';

export class Experiments {
  private experiments: WixExperiments | undefined;
  private initialized = false;

  private calcOverriddenExperiments(wixCodeApi: WixCodeAPI): ExperimentsBag {
    try {
      const url = new URL(wixCodeApi.location.url);

      const experimentsOverrides = url.searchParams.get(
        EXPERIMENTS_OVERRIDE_URL_PARAM,
      );

      return (
        experimentsOverrides?.split(',').reduce(
          (acc: ExperimentsBag, exp) => ({
            ...acc,
            [exp]: 'true',
          }),
          {},
        ) ?? {}
      );
    } catch (e) {}

    return {};
  }

  async init({
    scope,
    wixCodeApi,
    platformServicesAPI,
    logger,
    preloadedExperiments,
  }: {
    scope: string;
    wixCodeApi: WixCodeAPI;
    platformServicesAPI: PlatformServicesAPI;
    logger: ILogger;
    preloadedExperiments?: ExperimentsBag;
  }) {
    this.experiments = platformServicesAPI.essentials.createExperiments({
      useNewApi: true,
    });

    if (preloadedExperiments) {
      this.experiments.add(preloadedExperiments);
    } else {
      try {
        await this.experiments.load(scope);
      } catch (e) {
        logger.reportError('Failed loading experiments', e);
      }
    }

    this.experiments.add(this.calcOverriddenExperiments(wixCodeApi));

    this.initialized = true;
  }

  isOpen(expName: string) {
    if (!this.initialized || !this.experiments) {
      throw new Error('Experiments not initialized');
    }

    return this.experiments.enabled(expName);
  }

  reset() {
    this.initialized = false;
    this.experiments = undefined;
  }
}

export const experiments = new Experiments();
