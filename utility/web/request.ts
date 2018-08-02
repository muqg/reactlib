import { createQuery } from ".";
import { RequestMethod } from "../enums";
import { Dict } from "../type";
import { baseRequest } from "./baseRequest";


const DEFAULT_OPTIONS: RequestOptions = {
    requestDataFormat: "json"
}

export interface RequestOptions {
    cache?: RequestCache
    credentials?: RequestCredentials
    headers?: Dict<string>
    mode?: RequestMode
    redirect?: RequestRedirect

    /**
     * When enabled the HTTP method is passed as __method value in the body data
     * and all requests are sent as POST.
     */
    useBodyMethod?: boolean
    /**
     * Request data's format. All formats are included in the request body,
     * except for the methods that do not allow a body, where the request data
     * is appended as a query to the URL.
     */
    requestDataFormat?: "formData" | "json" | "query"
}

/**
 * Sends a request to the specified URL, reading response stream as text. Promise
 * always results in string except when error is thrown.
 * @param method HTTP request method.
 * @param url Requested URL.
 */
function request(method: RequestMethod, url: string): ReturnType<typeof baseRequest>
/**
 * Sends a request to the specified URL, reading response stream as text. Promise
 * always results in string except when error is thrown.
 * @param method HTTP request method.
 * @param url Requested URL.
 * @param body Request body's data.
 */
function request(method: RequestMethod, url: string, body: Dict<string>): ReturnType<typeof baseRequest>
/**
 * Sends a request to the specified URL, reading response stream as text. Promise
 * always results in string except when error is thrown.
 * @param method HTTP request method.
 * @param url Requested URL.
 * @param body Request body's data.
 * @param options Request options.
 */
function request(method: RequestMethod, url: string, body: Dict<string>, options: RequestOptions): ReturnType<typeof baseRequest>

function request(method: RequestMethod, url: string, body: Dict<string> = {} , options: RequestOptions = DEFAULT_OPTIONS) {
    const headers = options.headers || {} as Dict<string>

    if(options.useBodyMethod) {
        body["__method"] = method
        method = RequestMethod.POST
    }

    const requestInit: RequestInit = {
        cache: options.cache,
        credentials: options.credentials,
        method: method,
        mode: options.mode,
        redirect: options.redirect,
        referrer: "no-referrer",
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
        headers["Content-Type"] = "application/json"
    }
    else if(options.requestDataFormat === "query") {
        requestInit.body = createQuery(body)
    }

    requestInit.headers = headers

    return baseRequest(method, url, requestInit)
}

export { request };

