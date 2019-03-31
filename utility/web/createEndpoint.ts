import {request} from "."
import {RequestMethod} from ".."

export interface Endpoint<T extends object = object> {
    all: () => Promise<T[]>
    create: (data: T) => Promise<T>
    delete: (id: number | string) => Promise<void>
    get: (id: number | string) => Promise<T>
    save: (id: number | string, data: Partial<T>) => Promise<T>
}

function createEndpoint<T extends object>(url: string) {
    return {
        all: () => request<T[]>(RequestMethod.GET, url),

        create: (data: T) => request<T>(RequestMethod.POST, url, data),

        delete: async (id: number | string) => {
            await request(RequestMethod.DELETE, `${url}/${id}`)
        },

        get: (id: number | string) =>
            request<T>(RequestMethod.GET, `${url}/${id}`),

        save: (id: number | string, data: Partial<T>) =>
            request<T>(RequestMethod.PUT, `${url}/${id}`, data),
    }
}

export {createEndpoint}
