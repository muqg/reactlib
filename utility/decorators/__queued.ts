interface QueuedElement<T> {
    callback: (...args: any[]) => Promise<T>
    args: any[]
    resolve: (val: T) => void
}

/**
 * Allows method calls to be executed in their occuring order.
 *
 * __NOTE__: This is not instance specific.
 */
function queued() {
    return <T>(_target: any, _propertyKey: string, descriptor: TypedPropertyDescriptor<QueuedElement<T>["callback"]>) => {
        const originalMethod = descriptor.value
        if(!originalMethod)
            return

        let queue = [] as QueuedElement<T>[]
        let isExecuting = false

        descriptor.value = (...args) => {
            const element: QueuedElement<T> = {
                callback: originalMethod,
                args: args,
                resolve: () => {}
            }
            // An empty Promise that will resolve once the queue has reached the callback in order.
            const result = new Promise<T>((resolve) => {
                element.resolve = resolve
            })

            queue.push(element)

            if(!isExecuting) {
                isExecuting = true;

                // Start an execution queue.
                (async () => {
                    while(queue.length > 0) {
                        const element = queue.shift()
                        if(element) {
                            element.resolve(await element.callback(...element.args))
                        }
                    }
                    isExecuting = false
                })()
            }

            return result
        }
    }
}


export { queued }
