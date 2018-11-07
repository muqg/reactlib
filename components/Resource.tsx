import * as React from "react";
import { NotificationContext } from ".";
import { lock, RequestException, RequestMethod } from "../utility";
import { isString, isType } from "../utility/assertions";
import { createModelComponent } from "../utility/react";
import { request } from "../utility/web";


type ResourceCallback<T extends object> = (resource: T) => string | void | Promise<string | void>

interface ResourceChildrenProps<T extends object> {
    /**
     * Sends request to delete the resource. Undefined if a new
     * resource is being managed.
     */
    delete?: (resource: T) => void
    /**
     * Whether a request or an action is currently being processed.
     */
    isWorking: boolean
    /**
     * Resource's modelling component.
     */
    Model: ReturnType<typeof createModelComponent>
    /**
     * The resource.
     */
    resource: T
    /**
     * Sends a request to save the resource or create a new one.
     */
    save: (resource: T) => void
}

export interface ResourceProps<T extends object> {
    children: (props: ResourceChildrenProps<T>) => React.ReactNode
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
    url: string
}

interface State<T extends object> {
    isWorking: boolean
    resource: T
}

class Resource<T extends object = object> extends React.Component<ResourceProps<T>, State<T>> {
    static contextType = NotificationContext
    static defaultProps = {
        url: document.location!.href,
    }

    state: State<T> = {
        isWorking: false,
        resource: this.props.default
    }
    model = createModelComponent(this, "resource")

    async componentDidMount() {
        await this.load({} as any)
    }

    async componentDidUpdate(prevProps: ResourceProps<T>) {
        await this.load(prevProps.id)
    }

    private async load(prevId: ResourceProps<T>["id"]) {
        if(this.props.id === prevId)
            return

        let resource = this.props.default
        if(this.props.id) {
            // Only work before fetching an existing resource
            // to avoid an etra render for new resources.
            this.work()

            try {
                const url = this.props.url + "/" + this.props.id
                resource = await request<T>(RequestMethod.GET, url)
            }
            catch(ex) {
                this.catch(ex)
            }
        }

        this.work(resource)
    }

    save = lock(async () => {
        let {resource} = this.state
        const {id, saved, saving} = this.props

        this.work()

        try {
            if(!saving || !this.error(await saving(resource))) {
                const method = id ? RequestMethod.PUT : RequestMethod.POST
                const url = this.props.url + (method === RequestMethod.PUT ? "/" + id : "")
                const payload = JSON.stringify(resource)

                // @ts-ignore Remove this ignore when the one below is removed.
                const response = await request<Partial<T>>(method, url, {payload})
                // @ts-ignore Spread types may be created only from object types.
                resource = {...resource, ...response}

                if(saved)
                    this.error(await saved(resource))
            }
        }
        catch(ex) {
            this.catch(ex)
        }

        this.work(resource)
    })

    delete = lock(async () => {
        if(!this.props.id)
            return

        let {resource} = this.state
        const {deleting, deleted} = this.props

        this.work()

        try {
            if(!deleting || !this.error(await deleting(resource))) {
                const url = this.props.url + "/" + this.props.id
                const payload = JSON.stringify(resource)
                await request(RequestMethod.DELETE, url, {payload})

                resource = this.props.default

                if(deleted)
                    this.error(await deleted(resource))
            }
        }
        catch(ex) {
            this.catch(ex)
        }

        this.work(resource)
    })

    private error(err: string | void) {
        if(isString(err)) {
            this.context(err)
            return true
        }
        return false
    }

    private catch(ex: any) {
        console.error(ex)

        let msg = this.props.exceptionText
        if(!msg) {
            if(isType<RequestException>(ex, () => ex.status))
                msg = ex.text
            else
                msg = "Error"
        }
        this.context(msg)
    }

    private work(resource?: T) {
        let nextState: State<T>
        if(resource)
            nextState = {resource, isWorking: false}
        else
            nextState = {isWorking: false} as State<T>

        this.setState(nextState)
    }

    render() {
        return this.props.children({
            delete: this.props.id ? this.delete : undefined,
            isWorking: this.state.isWorking,
            Model: this.model,
            resource: this.state.resource,
            save: this.save
        })
    }
}


export { Resource };

