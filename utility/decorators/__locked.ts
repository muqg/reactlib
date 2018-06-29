/**
 * Allows the method to ignore any calls while it is already executing.
 *
 * __NOTE__: This is not instance specific.
 */
function locked() {
    return <T>(_target: any, _propertyKey: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<T>>) => {
        const originalMethod = descriptor.value

        if(!originalMethod)
            return

        let executing: Promise<T> | null = null
        descriptor.value = async (...args) => {
            if(!executing) {
                executing = originalMethod(...args)
                executing.then(() => { executing = null })
            }
            return executing
        }
    }
}


export { locked }
