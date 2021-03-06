import {Model} from "."
import {RequestMethod, ValidationError} from "../utility"
import {isString} from "../utility/assertions"
import {call} from "../utility/function"
import {request} from "../utility/web"
import {useNotify} from "./useNotify"
import {useTask} from "./useTask"

export interface ResourceProps<T extends object = object> {
  /**
   * Called when an exception occurs both for save and delete.
   */
  catch?: (
    exception: any,
    resource: T,
  ) => string | void | Promise<string | void>
  /**
   * Id of the resource. Falsey value for a new resource.
   */
  id: number | string | null | undefined
  /**
   * Called before deleting a resource. May return a string with an error
   * message to show it as notification and cancel the process.
   */
  deleting?: (resource: T) => ValidationError
  /**
   * Called after deleting a resource. May return a string to show as
   * notification for when deletion is done.
   */
  deleted?: (resource: T) => ValidationError | Promise<ValidationError>
  /**
   * A resource model to be used.
   */
  model: Model<T>
  /**
   * Called before saving a resource. May return a string with an error message
   * to show it as notification and cancel the process. This makes it a perfect
   * place for data validation.
   */
  saving?: (resource: T) => ValidationError
  /**
   * Called after saving a resource. May return a string to show as
   * notification for when saving is done.
   */
  saved?: (resource: Promise<T>) => ValidationError | Promise<ValidationError>
  /**
   * URL to the resource (without id appended).
   */
  url?: string
}

export interface ResourceManager<T extends object = object> {
  /**
   * Resource's data.
   */
  data: T
  /**
   * Send a request to delete the resource.
   */
  delete: () => void
  /**
   * Whether a request is being awaited for.
   */
  isWorking: boolean
  /**
   * The resource model object.
   */
  model: Readonly<Model<T>>
  /**
   * Send a request to save the resource.
   *
   * POST request for new resource and PUT request for an existing one.
   */
  save: () => void
}

function useResource<T extends object>({
  model,
  url = document.location.href,
  ...props
}: ResourceProps<T>): ResourceManager<T> {
  const notify = useNotify()

  const resUrl = url + "/" + props.id

  function save() {
    return workerTask.run(async () => {
      const resource = model.$data()
      if (_checkForError(call(props.saving, resource))) {
        return
      }

      const method = props.id ? RequestMethod.PUT : RequestMethod.POST
      const requestURL = method === RequestMethod.PUT ? resUrl : url

      const nextResource = (async () => {
        const response = await request<Partial<T>>(method, requestURL, resource)
        return {...resource, ...response}
      })()

      const savedCallbackResult = call(props.saved, nextResource)

      await nextResource
      _checkForError(await savedCallbackResult)

      return nextResource
    })
  }

  function del() {
    return workerTask.run(async () => {
      if (!props.id) {
        return
      }

      const resource = model.$data()
      if (_checkForError(call(props.deleting, resource))) {
        return
      }

      const response = request(RequestMethod.DELETE, resUrl, resource)

      const deletedCallbackResult = call(props.deleted, resource)

      await response
      _checkForError(await deletedCallbackResult)
    })
  }

  function _checkForError(err: ValidationError) {
    if (isString(err)) {
      notify(err)
      return true
    }
    return false
  }

  const workerTask = useTask(async function*(worker: () => Promise<T | void>) {
    const error = model.$firstError()
    if (error) {
      notify(error)
      return
    }

    try {
      const response = await worker()

      yield
      if (response) {
        model.$change(response)
      }
    } catch (ex) {
      const resource = model.$data()
      const catchCb = props.catch

      console.error(ex)
      setTimeout(async () => {
        const message = (await call(catchCb, ex, resource)) || "Error"
        notify(message)
      })
    }
  })

  return {
    model,
    save,

    isWorking: workerTask.isRunning,
    data: model.$data(),
    delete: del,
  }
}

export {useResource}
