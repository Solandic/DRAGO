import { AppDefId } from '../constants/constants';

const api = window.wixEmbedsAPI;

export function getAccessTokenFunction() {
  if (api.getAccessTokenFunction) {
    const apiResult = api.getAccessTokenFunction();
    return apiResult;
  } else {
    return () => Promise.resolve(api.getAppToken(AppDefId));
  }
}
