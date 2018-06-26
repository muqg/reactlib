import { Pointer } from "./type";

type PointerReader<T> = () => T
type PointerWriter<T> = (v: T) => void

/**
 * Creates a pointer from a value.
 * @param value The initial pointer value.
 */
function createPointer<T>(value: T): Pointer<T>
/**
 * Creates a pointer to a variable.
 *
 * - Usage: createPointer(() => var, (v) => var = v)
 * @param reader callback to read the value.
 * @param writer Callback to write the value.
 */
function createPointer<T>(reader: PointerReader<T>, writer: PointerWriter<T>): Pointer<T>

function createPointer<T>(reader: PointerReader<T> | T, writer?: PointerWriter<T>): Pointer<T> {
    let value = reader

    const read: PointerReader<T> = writer ? reader as PointerReader<T> : () => value as T
    const write: PointerWriter<T> = writer ? writer : (val) => value = val

    return {
        get value() {
            return read()
        },
        set value(val: T) {
            write(val)
        }
    }
}


export { createPointer }
