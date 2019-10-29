/**
 * Represents a RGBA color.
 */
export interface Color {
  /**
   * Color's transparency value (alpha channel).
   */
  alpha: number
  /**
   * Red color value.
   */
  red: number
  /**
   * Green color value.
   */
  green: number
  /**
   * Blue color value.
   */
  blue: number
}

/**
 * A simple dictionary with string keys and values of generic type.
 *
 * @deprecated Use built-in Record type instead as `Record<string, T>`
 */
export interface Dict<T> {
  [key: string]: T
}

/**
 * A simple dictionary that is the same as Dict except that its values are also
 * explicitly typed as possibly undefined which makes it safer to use in many
 * cases.
 *
 * @deprecated Use built-in Record typ instead as `Record<string, T | undefined>`
 */
export interface UDict<T> {
  [key: string]: T | undefined
}

/**
 * Represents a pointer value.
 */
export interface Pointer<T> {
  /**
   * Current pointer value.
   */
  value: T
}

/**
 * A basic object with a name and a key.
 *
 * @deprecated Will be removed in future update.
 */
export interface NamedKey<T = string> {
  id: T
  name: string
}

/**
 * Represents all valid JSON-serializable values.
 */
export type Serializable =
  | string
  | number
  | object
  | Array<any>
  | boolean
  | null

/**
 * Represents a basic dictionary type.
 *
 * @deprecated Use built-in Record type instead where
 * `Dictionary<T, T[keyof T]> === Record<keyof T, T[keyof T]>`
 */
export type Dictionary<K extends object, V = K[keyof K]> = {[key in keyof K]: V}

/**
 * @deprecated Use built-in Record type instead where
 * `List<string, keyof T> === Record<keyof T, string>`
 */
export type List<
  V,
  K extends string | number | symbol = string | number | symbol
> = {[key in K]: V}

export interface ResourceObject<T extends string | number = number> {
  id: T
}

export type Action<
  T extends string = string,
  V = any,
  U extends object = object
> = {
  type: T
  value: V
} & {[K in keyof U]: U[K]}

/**
 * @deprecated Use Action instead.
 */
export interface ActionWithOptions<
  T extends string = string,
  V = any,
  O extends object = object
> extends Action<T, V> {
  options: O
}

/**
 * @deprecated Will be removed or changed dramatically in future update.
 */
export type Endpoint<T extends object = object> = {
  all: () => Promise<T[]>
  create: (data: T) => Promise<T>
  delete: (id: number | string) => Promise<void>
  get: (id: number | string) => Promise<T>
  save: (id: number | string, data: Partial<T>) => Promise<T>
}

/**
 * A simple type to add index access to an object, without modifying its typing
 * in any way. Its intended to be used with tsconfig
 * `suppressImplicitAnyIndexErrors: false`
 */
export type Indexed<T extends object> = {[P in keyof T]: T[P]}
