/**
 * Allows the method to be executed only the first time it is called.
 *
 * __NOTE__: This is not instance specific.
 */
function sealed() {
    return <T>(_target: any, _propertyKey: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => T>) => {
        const originalMethod = descriptor.value

        if(!originalMethod)
            return

        let sealedResult: T | null = null
        descriptor.value = (...args) => {
            if(!sealedResult)
                sealedResult = originalMethod(...args)
            return sealedResult
        }
    }
}


export { sealed }
