import type { MemoryStorage } from '../../types';

let memoryStorage: MemoryStorage;

export function setMemoryStorage(storage: MemoryStorage) {
  memoryStorage = storage;
}

export function getMemoryStorage() {
  return memoryStorage;
}

export function getAndParseMemoryStorageItem(key: string) {
  const jsonValue = getMemoryStorage().getItem(key);
  return jsonValue && JSON.parse(jsonValue);
}
