/**
 * Allows method calls to be executed in their occuring order.
 *
 * __NOTE__: This is not instance specific.
 */
function queued() {
    return (_target: any, _propertyKey: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => any>) => {
        const originalMethod = descriptor.value
        if(!originalMethod)
            return

        let queue = [] as ((...args: any[]) => any)[]
        let executor: Promise<void> | undefined = undefined

        descriptor.value = async (...args) => {
            queue.push(() => originalMethod(...args))

            if(!executor) {
                executor = (async () => {
                    while(queue.length > 0) {
                        const element = queue.shift()
                        if(element)
                            await element()
                    }
                    executor = undefined
                })()
            }
            return executor
        }
    }
}


export { queued }
