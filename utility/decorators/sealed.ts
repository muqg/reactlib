/**
 * Allows the method to be executed only the first time it is called.
 *
 * __NOTE__: This is not instance specific.
 */
function sealed() {
    return (_target: any, _propertyKey: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => any>) => {
        const originalMethod = descriptor.value

        if(!originalMethod)
            return

        let isExcuted = false
        descriptor.value = (...args) => {
            if(!isExcuted) {
                isExcuted = true
                return originalMethod(...args)
            }
        }
    }
}


export { sealed }
