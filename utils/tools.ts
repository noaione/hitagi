export type NoneType = undefined | null;

export function isNone(value: unknown): value is NoneType {
  return value === undefined || value === null;
}

export function b64encode(data: string) {
  return Buffer.from(data, "utf-8").toString("base64");
}

export function b64decode(data: string) {
  return Buffer.from(data, "base64").toString("utf-8");
}
