import { Dict, RequestException } from "..";
import { RequestMethod } from "../enums";

const X_CSRF_TOKEN = (() => {
    const element = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
    return element ? element.content : ""
})()

// TODO: Lib | Replace RequestInit interface for options with another interface that
// mimics the allowed options.
function baseRequest(method: RequestMethod, url: string, options: RequestInit) {
    const headers = (options.headers || {}) as Dict<string>
    headers["X-CSRF-TOKEN"] = X_CSRF_TOKEN
    headers["X-Requested-With"] = "XMLHttpRequest"
    headers["Accept"] = "application/json; charset=utf-8";

    const requestInit: RequestInit = {
        body: options.body,
        cache: options.cache || "no-cache",
        credentials: options.credentials || "same-origin",
        headers: headers,
        method: method,
        mode: options.mode ||"cors",
        redirect: options.redirect || "follow",
        referrer: "no-referrer",
    }

    return window.fetch(url, requestInit)
        .then(response => {
            if(!response.ok) {
                throw {
                    status: response.status,
                    statusText: response.statusText
                } as RequestException
            }
            return response.json()
        })
}

export { baseRequest };
