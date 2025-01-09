import type { WarmupDataService as IWarmupDataService } from '../types';

type ViewerWarmupDataService = {
  get: (key: string) => any;
  set: (key: string, value: any) => void;
};

export class WarmupDataService implements IWarmupDataService {
  private readonly callMap: Record<string, boolean> = {};

  constructor(
    private readonly viewerWarmupDataService: ViewerWarmupDataService,
  ) {}

  getData<T>(key: string) {
    if (this.callMap[key]) {
      return null;
    }

    const warmupData = this.viewerWarmupDataService.get(key) as T;
    this.callMap[key] = true;
    return warmupData;
  }

  setData<T>(key: string, value: T) {
    return this.viewerWarmupDataService.set(key, value);
  }
}
