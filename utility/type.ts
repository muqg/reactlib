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
 */
export interface Dict<T> {
  [key: string]: T
}

/**
 * A simple dictionary that is the same as Dict except that its values are also
 * explicitly typed as possibly undefined which makes it safer to use in many
 * cases.
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
 */
export type Dictionary<K extends object, V = K[keyof K]> = {[key in keyof K]: V}

export type List<
  V,
  K extends string | number | symbol = string | number | symbol
> = {[key in K]: V}

export interface ResourceObject<T extends string | number = number> {
  id: T
}

export interface Action<T extends string = string, V = any> {
  type: T
  value: V
}

export interface ActionWithOptions<
  T extends string = string,
  V = any,
  O extends object = object
> extends Action<T, V> {
  options: O
}
