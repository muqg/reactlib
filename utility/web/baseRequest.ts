import { Dict } from "..";

const X_CSRF_TOKEN = (() => {
    const element = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
    return element ? element.content : ""
})()

const defaultOptions: RequestInit = {
    cache: "no-cache",
    credentials: "same-origin",
    mode: "cors",
    redirect: "follow",
    referrer: "no-referrer"
}

async function baseRequest<T = any>(url: string, options: RequestInit): Promise<T> {
    const headers = (options.headers || {}) as Dict<string>
    headers["X-CSRF-TOKEN"] = X_CSRF_TOKEN
    headers["X-Requested-With"] = "XMLHttpRequest"
    headers["Accept"] = "application/json; charset=utf-8";

    const requestInit: RequestInit = {
        ...defaultOptions,
        ...options,
        headers,
    }

    const response = await fetch(url, requestInit)
    if(!response.ok) {
        throw response
    }

    let result: any = await response.text()
    try {
        result = JSON.parse(result)
    }
    catch {
        /**
         * No need to take any action since result
         * is already initialized as response's text.
         */
    }

    return result
}

export { baseRequest };

