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
        .then(async (response) => {

            let responseBody: any = {}
            try {
                responseBody = await response.json()
            }
            catch {
                /**
                 * No need to take any action since responseBody
                 * is already initialized as an empty object.
                 */
            }

            if(!response.ok) {
                throw {
                    body: responseBody,
                    status: response.status,
                    statusText: response.statusText,
                    text: responseBody.__error || responseBody.message || "RequestException",
                } as RequestException
            }

            return responseBody
        })
}

export { baseRequest };
