export interface Action<V = any, T extends string = string> {
    type: T
    value: V
}

export function createAction<V = any, T extends string = string>(
    type: T, value: V
): Action<V, T> {
    return {
        type,
        value
    }
}
