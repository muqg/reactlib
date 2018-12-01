import { useContext, useEffect, useState } from "react";
import { Model, useModel } from ".";
import { NotificationContext } from "../components";
import { RequestException, RequestMethod } from "../utility";
import { isString, isType } from "../utility/assertions";
import { call } from "../utility/function";
import { ReactStateSetter } from "../utility/react";
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
    id?: ResourceManager["currentId"]
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

export interface ResourceManager<T extends object = object> {
    /**
     * The id of the currently managed resource.
     */
    currentId: string | number | null | undefined
    /**
     * Resource's data.
     */
    data: T
    /**
     * Sends a request to delete the resource.
     */
    delete: () => Promise<void>
    /**
     * Whether a request is being awaited for.
     */
    isWorking: boolean
    /**
     * The resource model object.
     */
    model: Readonly<Model<T>>
    /**
     * Sends a request to save the resource.
     *
     * A POST request for new resource and a PUT request for an existing one.
     */
    save: () => Promise<void>
    /**
     * Sets the current id of the resource.
     */
    setId: ReactStateSetter<ResourceManager["currentId"]>
}


function useResource<T extends object>(
    {url = document.location!.href, ...props}: ResourceProps<T>
): ResourceManager<T> {
    const [id, setId] = useState(props.id)
    const [isWorking, setIsWorking] = useState(false)
    const model = useModel(props.default)
    const notify = useContext(NotificationContext)

    const resUrl = url + "/" + id

    useEffect(() => {
        if(id) {
            _work(async () => await request<T>(RequestMethod.GET, resUrl))
        }
        else {
            // Resetting resource outside of the worker
            // wrapper skips an unnecessary render.
            model.$set(props.default)
        }
    }, [id])

    async function save() {
        await _work(async () => {
            const resource = model.$data
            if(_error(await call(props.saving, resource)))
                return

            const method = id ? RequestMethod.PUT : RequestMethod.POST
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

    async function del() {
        if(!id)
            return

        await _work(async () => {
            const resource = model.$data
            if(_error(await call(props.deleting, resource)))
                return

            const payload = JSON.stringify(resource)
            await request(RequestMethod.DELETE, resUrl, {payload})

            _error(await call(props.deleted, resource))

            setId(null)
            // @ts-ignore Spread types may be created only from object types.
            return {...props.default}
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
                model.$set(resource)
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
        save,
        setId,

        currentId: id,
        data: model.$data,
        delete: del,
        model: model,
    }
}


export { useResource };

