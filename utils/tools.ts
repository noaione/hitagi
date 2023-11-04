export type NoneType = undefined | null;

/**
 * Check if value is NoneType (undefined or null).
 * @param value data to check
 * @returns is NoneType or not
 */
export function isNone(value: unknown): value is NoneType {
  return value === undefined || value === null;
}

/**
 * A better base64 encoder (alternative to `btoa`).
 *
 * Utilize `Buffer` to encode string and assume input is utf-8.
 * @param data string to encode
 * @returns encoded string
 */
export function b64encode(data: string) {
  // check if Buffer is available
  if (typeof Buffer === "undefined") {
    return btoa(data);
  }

  return Buffer.from(data, "utf8").toString("base64");
}

/**
 * A better base64 decoder (alternative to `atob`).
 *
 * Utilize `Buffer` to decode string and assume output is utf-8.
 * @param data base64 to decode
 * @returns decoded string
 */
export function b64decode(data: string) {
  if (typeof Buffer === "undefined") {
    return atob(data);
  }

  return Buffer.from(data, "base64").toString("utf8");
}
