import {Dict, Omit} from ".."
import {RequestMethod} from "../enums"
import {baseRequest} from "./baseRequest"

export type UploadOptions = Omit<RequestInit, "body" | "method">

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
function upload<T = any>(
  url: string,
  file: File,
  body: Dict<string> = {},
  options: UploadOptions = {},
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

export {upload}
