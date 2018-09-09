export type Collection = object | Array<any>

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
 * Error thrown by library's request functions.
 */
export interface RequestException {
    status: number
    statusText: string
}
