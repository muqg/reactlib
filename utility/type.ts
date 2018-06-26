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
