import { wait } from "../wait";

/**
 * Delays method execution, allowing for it to be called multiple times in the
 * mean time and only executing with the latest arguments.
 *
 * __NOTE__: This is not instance specific.
 */
function delayed(time: number = 250) {
    return <T>(_target: any, _propertyKey: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<T>>) => {
        const originalMethod = descriptor.value
        if(!originalMethod)
            return

        let current: Promise<T> | null = null
        let currentArgs = []

        descriptor.value = async (...args) => {
            currentArgs = [...args]

            if(!current) {
                current = (async () => {
                    await wait(time)

                    const result = await originalMethod(...currentArgs)
                    current = null
                    currentArgs = []

                    return result
                })()
            }

            return current
        }
    }
}


export { delayed }
