import { upperFirst, camelCase } from 'lodash';

export const pascalCase = (str: string) => upperFirst(camelCase(str));

const URL_TEMPLATE_REGEX = /.*\?(.*?)}?$/;

export const extractSearchParams = (str: string) => {
  const [, match] = URL_TEMPLATE_REGEX.exec(str) || [];

  return match || '';
};
