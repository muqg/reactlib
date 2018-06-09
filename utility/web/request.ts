import { RequestMethod } from "../enums";
import { createQuery } from ".";
import { StringDict } from "../interfaces";

export interface RequestOptions {
    cache?: RequestCache
    credentials?: RequestCredentials
    headers?: StringDict<string>
    mode?: RequestMode
    redirect?: RequestRedirect
}

const X_CSRF_TOKEN = (() => {
    const element = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
    return element ? element.content : ""
})()

/**
 * Sends a request to the specified URL, reading response stream as text. Promise
 * always results in string except when error is thrown.
 * @param method HTTP request method.
 * @param url Requested URL.
 */
function request(method: RequestMethod, url: string): Promise<string | void>
/**
 * Sends a request to the specified URL, reading response stream as text. Promise
 * always results in string except when error is thrown.
 * @param method HTTP request method.
 * @param url Requested URL.
 * @param body Request body's data.
 */
function request(method: RequestMethod, url: string, body: StringDict<string>): Promise<string | void>
/**
 * Sends a request to the specified URL, reading response stream as text. Promise
 * always results in string except when error is thrown.
 * @param method HTTP request method.
 * @param url Requested URL.
 * @param body Request body's data.
 * @param options Request options.
 */
function request(method: RequestMethod, url: string, body: StringDict<string>, options: RequestOptions): Promise<string | void>

function request(method: RequestMethod, url: string, body: StringDict<string> = {}, options: RequestOptions = {}) {
    const headers = options.headers || {} as StringDict<string>
    headers["X-CSRF-TOKEN"] = X_CSRF_TOKEN
    headers["X-Requested-With"] = "XMLHttpRequest"

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
    if(method === RequestMethod.GET || method === RequestMethod.HEAD) {
        const index = url.indexOf("?")
        const cleanURL = index >= 0 ? url.substring(0, index) : url
        url = cleanURL + "?" + createQuery(body)
    }
    else {
        const fd = new FormData()
        Object.keys(body).forEach(key => fd.append(key, body[key]))
        requestInit.body = fd
    }

    return window.fetch(url, requestInit)
        .then((response) => {
            if(!response.ok)
                throw(response.statusText)
            response.text()
        })
}


export default request
