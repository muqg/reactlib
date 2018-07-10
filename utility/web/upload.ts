import { Dict } from "..";
import { RequestMethod } from "../enums";
import { baseRequest } from "./baseRequest";

/**
 * Sends a file upload request to the specified URL using HTTP POST method.
 * @param url The URL to send the file to.
 * @param file The file to upload.
 */
function upload(url: string, file: File): ReturnType<typeof baseRequest>
/**
 * Sends a file upload request to the specified URL using HTTP POST method.
 * @param url The URL to send the file to.
 * @param file The file to upload.
 * @param body Request body's data.
 */
function upload(url: string, file: File, body: Dict<string>): ReturnType<typeof baseRequest>
/**
 * Sends a file upload request to the specified URL using HTTP POST method.
 * @param url The URL to send the file to.
 * @param file The file to upload.
 * @param body Request body's data.
 * @param options Request options.
 */
function upload(url: string, file: File, body: Dict<string>, options: RequestInit): ReturnType<typeof baseRequest>

function upload(url: string, file: File, body: Dict<string> = {}, options: RequestInit = {}) {
    const fd = new FormData()
    Object.entries<string>(body).map(([key, value]) => fd.append(key, value))
    fd.append("file", file)
    options.body = fd

    return baseRequest(RequestMethod.POST, url, options)
}

export { upload };
