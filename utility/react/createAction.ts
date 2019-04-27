export interface Action<
    V = any,
    T extends string = string,
    O extends object = object
> {
    options: O
    type: T
    value: V
}

export function createAction<
    V = any,
    T extends string = string,
    O extends object = object
>(type: T, value: V, options = {} as O): Action<V, T, O> {
    return {
        options,
        type,
        value,
    }
}
