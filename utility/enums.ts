import {List} from "./type"

export type RequestMethod =
  | "GET"
  | "HEAD"
  | "POST"
  | "PUT"
  | "DELETE"
  | "OPTIONS"
  | "PATCH"

export const RequestMethod: List<RequestMethod, RequestMethod> = {
  GET: "GET",
  HEAD: "HEAD",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  OPTIONS: "OPTIONS",
  PATCH: "PATCH",
}

/**
 * Style size modifiers.
 */
export const enum Size {
  Null = 0,
  Small = 1,
  Slim = 1.5,
  Medium = 2,
  Large = 3,
  Massive = 4,
  Huge = 6,
  Giant = 8,
}
