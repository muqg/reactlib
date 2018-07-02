import { StringDict } from ".";

/**
 * A collection can either be represented by any keyed element such as object
 * or array of any type.
 */
export type Collection<T = any> = StringDict<T> | T[]

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
 * A simple key-value pair.
 */
export interface KeyValuePair<K = string, V = string> {
    key: K
    value: V
}
