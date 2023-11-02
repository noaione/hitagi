export type NoneType = undefined | null;

export function isNone(value: unknown): value is NoneType {
  return value === undefined || value === null;
}
