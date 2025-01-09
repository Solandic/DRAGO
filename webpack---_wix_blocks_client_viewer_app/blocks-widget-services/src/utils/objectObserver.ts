import { isObjectLike, isFunction, get, set } from 'lodash';
import { PropsChangedHandler } from '@wix/blocks-widget-services-types';

function isPojo(obj: object) {
  if (!isObjectLike(obj)) {
    return false;
  }

  return Object.getPrototypeOf(obj) === Object.prototype;
}

const clone = <T extends object>(obj: T): T => JSON.parse(JSON.stringify(obj));

export function pushObservedObject<T extends object>(
  targetObject: unknown,
  objectToWatch: T,
  initialProps: string[],
  onPropsChanged: PropsChangedHandler<T>,
  shouldAddInternalApi: boolean,
): asserts targetObject is typeof targetObject & T {
  const observersCache: Record<string, any> = {};

  function definePropertiesOnTarget(
    target: unknown,
    objectRoot: T,
    props: string[] | null,
    path: string[] = [],
  ) {
    props =
      props ||
      Object.getOwnPropertyNames(objectRoot).filter(
        (prop) => !isFunction(objectRoot[prop as keyof T]),
      );

    for (const propName of props) {
      defineProperty(target, propName, path);
    }

    return target;
  }

  function getObserver(obj: T, path: string[]) {
    const propPathName = path.join('/');
    if (observersCache[propPathName]) {
      return observersCache[propPathName];
    }

    const newObserver = definePropertiesOnTarget({}, obj, null, path);

    observersCache[propPathName] = newObserver;

    return newObserver;
  }

  function defineProperty(target: unknown, propName: string, path: string[]) {
    Object.defineProperty(target, propName, {
      configurable: false,
      enumerable: true,
      get() {
        const propPath = path.concat(propName);
        let propValue = get(objectToWatch, propPath);

        if (isPojo(propValue)) {
          propValue = getObserver(propValue, propPath);
        }

        return propValue;
      },
      set(newValue) {
        const propPath = path.concat(propName);
        const propPathName = propPath.join('/');

        const oldPropsClone = clone(objectToWatch);

        set(objectToWatch, propPath, newValue);
        delete observersCache[propPathName]; // eslint-disable-line @typescript-eslint/no-dynamic-delete

        const internalApi = shouldAddInternalApi
          ? { _internalApiDoNotUse: { propName, path: propPath } }
          : undefined;

        onPropsChanged(oldPropsClone, objectToWatch, internalApi);
      },
    });
  }

  definePropertiesOnTarget(targetObject, objectToWatch, initialProps);
}
