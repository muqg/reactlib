/**
 * Allows the method to ignore any calls while it is already executing.
 *
 * __NOTE__: This is not instance specific.
 */
function locked() {
    return (_target: any, _propertyKey: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>) => {
        const originalMethod = descriptor.value

        if(!originalMethod)
            return

        let executing: Promise<any> | undefined = undefined
        descriptor.value = async (...args) => {
            if(!executing)
                executing = originalMethod(...args).then(() => { executing = undefined })
            return executing
        }
    }
}


export { locked }
