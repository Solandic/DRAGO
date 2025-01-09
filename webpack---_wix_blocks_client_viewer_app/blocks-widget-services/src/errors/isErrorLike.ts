export function isError(error: unknown): error is Error {
  return Boolean(error) && error instanceof Error;
}
