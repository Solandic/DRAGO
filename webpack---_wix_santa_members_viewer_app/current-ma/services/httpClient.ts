import type { IHttpClient } from '@wix/yoshi-flow-editor';

export class HttpClientService {
  constructor(private readonly httpClient: IHttpClient) {}

  public async get<T>(url: string): Promise<T | {}> {
    try {
      const response = await this.httpClient.get<T>(url);
      return response.data;
    } catch (error) {
      console.log('error fetching data', (error as Error).message);
      return {};
    }
  }

  public async post<T>(url: string, body: unknown): Promise<T | {}> {
    try {
      const response = await this.httpClient.post<T>(url, body);
      return response.data;
    } catch (error) {
      console.log('error posting data', (error as Error).message);
      return {};
    }
  }
}
