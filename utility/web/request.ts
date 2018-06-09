import { RequestMethod } from "../enums";
import { createQuery } from ".";

export interface RequestOptions {
    headers?: Headers
}

interface Headers {
    [key: string]: string
}

function request(method: RequestMethod, url: string, bodyData: object, options: RequestOptions) {
        const headers = options.headers || {} as Headers

        const requestInit: RequestInit = {
            cache: "no-cache",
            credentials: "same-origin",
            headers: headers,
            method: method,
            mode: "cors",
            redirect: "follow",
            referrer: "no-referrer"
        }

        // GET and HEAD methods are not allowed to have a request body.
        if(method === RequestMethod.GET || method === RequestMethod.HEAD) {
            const index = url.indexOf("?")
            const cleanURL = index >= 0 ? url.substring(0, index) : url
            url = cleanURL + "?" + createQuery(bodyData)
        }
        else {
            requestInit.body = JSON.stringify(bodyData)
        }

        return window.fetch(url, requestInit)
            .then(function(response) {
                return response.text()
            })
    }


export default request
