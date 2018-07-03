import { RequestMethod } from "../enums";
import { createQuery } from ".";
import { StringDict } from "../interfaces";

export interface RequestOptions {
    cache?: RequestCache
    credentials?: RequestCredentials
    headers?: StringDict<string>
    mode?: RequestMode
    redirect?: RequestRedirect

    /**
     * When enabled the HTTP method is passed as __method value in the form data
     * and all requests are sent as POST.
     */
    useFormDataMethod?: boolean
    /**
     * Request data's format. All formats are included in the request body,
     * except for the methods that do not allow a body, where the request data
     * is appended as a query to the URL.
     */
    requestDataFormat?: "formData" | "json" | "query"
}

const X_CSRF_TOKEN = (() => {
    const element = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
    return element ? element.content : ""
})()

const DEFAULT_OPTIONS: RequestOptions = {
    requestDataFormat: "json"
}

/**
 * Sends a request to the specified URL, reading response stream as text. Promise
 * always results in string except when error is thrown.
 * @param method HTTP request method.
 * @param url Requested URL.
 */
function request(method: RequestMethod, url: string): Promise<string>
/**
 * Sends a request to the specified URL, reading response stream as text. Promise
 * always results in string except when error is thrown.
 * @param method HTTP request method.
 * @param url Requested URL.
 * @param body Request body's data.
 */
function request(method: RequestMethod, url: string, body: StringDict<string>): Promise<string>
/**
 * Sends a request to the specified URL, reading response stream as text. Promise
 * always results in string except when error is thrown.
 * @param method HTTP request method.
 * @param url Requested URL.
 * @param body Request body's data.
 * @param options Request options.
 */
function request(method: RequestMethod, url: string, body: StringDict<string>, options: RequestOptions): Promise<string>

function request(method: RequestMethod, url: string, body: StringDict<string> = {} , options: RequestOptions = DEFAULT_OPTIONS) {
    const headers = options.headers || {} as StringDict<string>
    headers["X-CSRF-TOKEN"] = X_CSRF_TOKEN
    headers["X-Requested-With"] = "XMLHttpRequest"

    if(options.useFormDataMethod) {
        body["__method"] = method
        method = RequestMethod.POST
    }

    const requestInit: RequestInit = {
        cache: options.cache || "no-cache",
        credentials: options.credentials || "same-origin",
        headers: headers,
        method: method,
        mode: options.mode ||"cors",
        redirect: options.redirect || "follow",
        referrer: "no-referrer"
    }

    // GET and HEAD methods are not allowed to have a request body.
    if(method === RequestMethod.GET || method === RequestMethod.HEAD || method === RequestMethod.OPTIONS) {
        const index = url.indexOf("?")
        const cleanURL = index >= 0 ? url.substring(0, index) : url
        url = cleanURL + "?" + createQuery(body)
    }
    else if(options.requestDataFormat === "formData") {
        const fd = new FormData()
        Object.keys(body).forEach(key => fd.append(key, body[key]))
        requestInit.body = fd
    }
    else if(options.requestDataFormat === "json") {
        requestInit.body = JSON.stringify(body)
    }
    else if(options.requestDataFormat === "query") {
        requestInit.body = createQuery(body)
    }

    return window.fetch(url, requestInit)
        .then((response) => {
            if(!response.ok)
                throw(`(${response.status}) ${response.statusText}`)
            return response.text()
        })
}

export {
    request
}
