import {createQuery} from "."
import {RequestMethod} from "../enums"
import {Dict, Omit} from "../type"
import {baseRequest} from "./baseRequest"
import {isEmpty} from "../collection"

export type RequestOptions = Omit<RequestInit, "body" | "method">

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
function request<T = any>(
  method: RequestMethod,
  url: string,
  data = {},
  options: RequestOptions = {},
): Promise<T> {
  const headers = (options.headers || {}) as Dict<string>
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
    headers["Content-Type"] = "application/json"
    requestInit.body = JSON.stringify(data)
  }

  requestInit.headers = headers
  return baseRequest(url, {
    ...requestInit,
    method,
  })
}

export {request}
