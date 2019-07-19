import {isEmpty} from "../collection"
import {RequestMethod} from "../enums"
import {Dict} from "../type"
import {createQuery} from "./createQuery"

export type RequestOptions = Omit<RequestInit, "body" | "method">

const X_CSRF_TOKEN = (() => {
  const element = document.querySelector<HTMLMetaElement>(
    'meta[name="csrf-token"]',
  )
  return element ? element.content : ""
})()

const defaultOptions: RequestInit = {
  cache: "no-cache",
  credentials: "same-origin",
  mode: "cors",
  redirect: "follow",
  referrer: "no-referrer",
}

export class ResponseError extends Error {
  constructor(message: string, public response: Response) {
    super(message)
  }
}

async function baseRequest<T = any>(
  url: string,
  options: RequestInit,
): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set("X-CSRF-TOKEN", X_CSRF_TOKEN)
  headers.set("X-Requested-With", "XMLHttpRequest")
  headers.set("Accept", "application/json; charset=utf-8")

  const requestInit: RequestInit = {
    ...defaultOptions,
    ...options,
    headers,
  }

  const response = await fetch(url, requestInit)
  if (!response.ok) {
    throw new ResponseError(response.statusText, response)
  }

  let result: any = await response.text()
  try {
    result = JSON.parse(result)
  } catch {
    /**
     * No need to take any action since result
     * is already initialized as response's text.
     */
  }

  return result
}

/**
 * Sends a fetch request.
 *
 * @throws Throws the response object on request error.
 *
 * @param method HTTP request method.
 * @param url The URL to send the request to.
 * @param data A object that will be converted to JSON and passed as request's
 * body. If the requested method is not allowed to have a body then the data is
 * appended as a URL query.
 * @param options Request options.
 *
 * @returns Returns JSON if the response is in valid format or text otherwise.
 */
export function request<T = any>(
  method: RequestMethod,
  url: string,
  data = {},
  options: RequestOptions = {},
): Promise<T> {
  const headers = new Headers(options.headers)
  const requestInit: RequestInit = options

  // GET, HEAD and OPTIONS methods are not allowed to have a request body.
  if (
    method === RequestMethod.GET ||
    method === RequestMethod.HEAD ||
    method === RequestMethod.OPTIONS
  ) {
    if (!isEmpty(data)) {
      const index = url.indexOf("?")
      const cleanURL = index >= 0 ? url.substring(0, index) : url
      url = cleanURL + "?" + createQuery(data)
    }
  } else {
    headers.set("Content-Type", "application/json")
    requestInit.body = JSON.stringify(data)
  }

  requestInit.headers = headers
  return baseRequest(url, {
    ...requestInit,
    method,
  })
}

/**
 * Sends a file upload request to the specified URL using HTTP POST method.
 *
 * @throws Throws the response object on request error.
 *
 * @param url The URL to upload the file to.
 * @param file The file to upload.
 * @param body Request body's data.
 * @param options Request options.
 *
 * @returns Returns JSON if the response is in valid format or text otherwise.
 */
export function upload<T = any>(
  url: string,
  file: File,
  body: Dict<string> = {},
  options: RequestOptions = {},
): Promise<T> {
  const fd = new FormData()
  Object.entries<string>(body).map(([key, value]) => fd.append(key, value))
  fd.append("file", file)

  return baseRequest(url, {
    ...options,
    body: fd,
    method: RequestMethod.POST,
  })
}
