import { useContext, useEffect, useState } from "react";
import { useModel } from ".";
import { NotificationContext } from "../components";
import { RequestException, RequestMethod } from "../utility";
import { isString, isType } from "../utility/assertions";
import { call } from "../utility/function";
import { request } from "../utility/web";

type ResourceCallback<T extends object> = (resource: T) => string | void | Promise<string | void>

export interface ResourceProps<T extends object = object> {
    /**
     * Default data for the resource. Used when a new one is being created
     * and also when a resource is deleted and the data should be reset.
     */
    default: T
    /**
     * Text to be shown when an exceptional error occurs.
     */
    exceptionText?: string
    /**
     * Id of the resource. Falsey value for a new resource.
     */
    id: string | number | null | undefined
    /**
     * Called before deleting a resource. May return a string with an error
     * message to show it as notification and cancel the process.
     */
    deleting?: ResourceCallback<T>
    /**
     * Called after deleting a resource. May return a string to show as
     * notification for when deletion is done.
     */
    deleted?: ResourceCallback<T>
    /**
     * Called before saving a resource. May return a string with an error message
     * to show it as notification and cancel the process. This makes it a perfect
     * place for data validation.
     */
    saving?: ResourceCallback<T>
    /**
     * Called after saving a resource. May return a string to show as
     * notification for when saving is done.
     */
    saved?: ResourceCallback<T>
    /**
     * URL to the resource (without id appended).
     */
    url?: string
}

function useResource<T extends object>({url = document.location!.href, ...props}: ResourceProps<T>) {
    const [isWorking, setIsWorking] = useState(false)
    const [modelResource, resource, setResource] = useModel(props.default)

    const notify = useContext(NotificationContext)

    const resUrl = url + "/" + props.id

    useEffect(() => {
        if(props.id) {
            _work(async () => await request<T>(RequestMethod.GET, resUrl))
        }
        else {
            // Resetting resource outside of the worker
            // wrapper skips an unnecessary render.
            setResource(props.default)
        }
    }, [props.id])

    // Locking also makes this callback memoized.
    async function save() {
        await _work(async () => {
            if(_error(await call(props.saving, resource)))
                return

            const method = props.id ? RequestMethod.PUT : RequestMethod.POST
            const requestURL = method === RequestMethod.PUT ? resUrl : url
            const payload = JSON.stringify(resource)

            // @ts-ignore Spread types may be created only from object types.
            const response = await request<Partial<T>>(method, requestURL, {payload})

            // @ts-ignore Spread types may be created only from object types.
            const nextResource = {...resource, ...response}
            _error(await call(props.saved, nextResource))
            return nextResource
        })
    }

    // Locking also makes this callback memoized.
    async function del() {
        if(!props.id)
            return

        await _work(async () => {
            if(_error(await call(props.deleting, resource)))
                return

            const payload = JSON.stringify(resource)
            await request(RequestMethod.DELETE, resUrl, {payload})

            // @ts-ignore Spread types may be created only from object types.
            const nextResource = {...props.default}
            _error(await call(props.deleted, nextResource))
            return nextResource
        })
    }

    function _error(err: string | void) {
        if(isString(err)) {
            notify(err)
            return true
        }
        return false
    }

    async function _work(worker: () => Promise<T | void>) {
        // This will prevent sending duplicate requests.
        if(isWorking)
            return

        setIsWorking(true)
        try {
            const resource = await worker()
            if(resource)
                setResource(resource)
        }
        catch(ex) {
            console.error(ex)

            let msg = props.exceptionText || "Error"
            if(isType<RequestException>(ex, () => ex.status))
                msg = ex.text
            notify(msg)
        }
        setIsWorking(false)
    }

    return {
        isWorking,
        modelResource,
        save,

        data: resource,
        delete: del,
    }
}


export { useResource };

