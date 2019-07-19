import {request} from "."
import {RequestMethod} from ".."

export function createEndpoint<T extends object>(url: string) {
  return {
    all: () => request<T[]>(RequestMethod.GET, url),

    create: (data: T) => request<T>(RequestMethod.POST, url, data),

    delete: async (id: number | string) => {
      await request(RequestMethod.DELETE, `${url}/${id}`)
    },

    get: (id: number | string) => request<T>(RequestMethod.GET, `${url}/${id}`),

    save: (id: number | string, data: Partial<T>) =>
      request<T>(RequestMethod.PUT, `${url}/${id}`, data),
  }
}
