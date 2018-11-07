import * as React from "react";
import { NotificationContext } from ".";
import { lock, RequestException, RequestMethod } from "../utility";
import { isString, isType } from "../utility/assertions";
import { createModelComponent } from "../utility/react";
import { request } from "../utility/web";

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

interface Props<T extends object> {
    children: (props: ResourceChildrenProps<T>) => React.ReactNode
    /**
     * Default data for the resource. Used when a new one is being created
     * and also when a resource is deleted and the data should be reset.
     */
    default: T
    /**
     * Text to be shown for successful deletion.
     */
    deleteText: string
    /**
     * Text to be shown when an exceptional error occurs.
     */
    exceptionText?: string
    /**
     * Id of the resource. Falsey value for a new resource.
     */
    id: string | number | null | undefined
    /**
     * Called before deleting a resource. May optionally return a string to
     * indicate that an error has occured and thus cancel the deletion. The
     * returned string will be shown as a notification.
     */
    onDelete?: (resource: T) => string | void
    /**
     * Called after saving a resource. May optionall return a string to indicate
     * that an error has occured. The returned string will be shown as a notification.
     */
    onSave?: (resource: T) =>  string | void
    /**
     * Text to be shown on a successful save or creation of a resource.
     */
    saveText: string
    /**
     * URL to the resource (without id appended).
     */
    url: string
    /**
     * Called before saving a resource or creating a new one. Returning a string
     * indicates that validation is not successful and the returned string will
     * be shown as a notification.
     *
     * Method may alternatively be used as a "beforeSave" method to perform actions
     * before a resource is saved as an alternative to onSave which is always called
     * AFTER a resource is saved or created.
     */
    validate?: (resource: T) => string | void
}

interface State<T extends object> {
    isWorking: boolean
    resource: T
}

class Resource<T extends object> extends React.Component<Props<T>, State<T>> {
    static contextType = NotificationContext
    static defaultProps = {
        deleteText: "Deleted",
        saveText: "Saved",
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

    async componentDidUpdate(prevProps: Props<T>) {
        await this.load(prevProps.id)
    }

    private async load(prevId: Props<T>["id"]) {
        if(this.props.id === prevId)
            return

        this.work()

        let resource = this.props.default
        if(this.props.id) {
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
        const {id} = this.props

        const {validate} = this.props
        if(validate && this.error(validate(resource)))
            return

        this.work()

        try {
            const method = id ? RequestMethod.PUT : RequestMethod.POST
            const url = this.props.url + (method === RequestMethod.PUT ? "/" + id : "")
            const payload = JSON.stringify(resource)

            const response = await request<Partial<T>>(method, url, {payload})
            // @ts-ignore Spread types may be created only from object types.
            resource = {...resource, ...response}

            if(this.props.onSave)
                this.error(this.props.onSave(resource))
        }
        catch(ex) {
            this.catch(ex)
        }

        this.context(this.props.saveText)
        this.work(resource)
    })

    delete = lock(async () => {
        if(!this.props.id)
            return

        let {resource} = this.state
        this.work()

        try {
            const onDelete = this.props.onDelete

            if(onDelete && !this.error(await onDelete(resource))) {
                const url = this.props.url + "/" + this.props.id
                const payload = JSON.stringify(resource)
                await request(RequestMethod.DELETE, url, {payload})

                resource = this.props.default
            }
        }
        catch(ex) {
            this.catch(ex)
        }

        this.context(this.props.deleteText)
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

