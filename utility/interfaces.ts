
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
export interface StringDict<TValue> {
    [key: string]: TValue
}

/**
 * A simple dictionary with number keys and values of generic type.
 */
export interface NumberDict<TValue> {
    [key: number]: TValue
}