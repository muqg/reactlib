import { request } from ".";
import { RequestMethod } from "..";
import { except } from "../collection";

export interface Endpoint<T extends object = object> {
    all: () => Promise<T[]>
    create: (data: T) => Promise<T>
    delete: (id: number | string) => Promise<void>
    get: (id: number | string) => Promise<T>
    save: (id: number | string, data: Partial<T>) => Promise<T>
}

// @ts-ignore A rest parameter must be of an array type.
function createEndpoint<T extends object, E extends keyof Endpoint = keyof Endpoint>(url: string, ...exclude?: E[] = []) {
    return except<Endpoint<T>, E>({
        all: () =>
            request<T[]>(RequestMethod.GET, url),

        create: (data: T) =>
            request<T>(RequestMethod.POST, url, {payload: JSON.stringify(data)}),

        delete: async (id: number | string) =>
            { await request(RequestMethod.DELETE, `${url}/${id}`) },

        get: (id: number | string) =>
            request<T>(RequestMethod.GET, `${url}/${id}`),

        save: (id: number | string, data: Partial<T>) =>
            request<T>(RequestMethod.PUT, `${url}/${id}`, {payload: JSON.stringify(data)})
    }, ...exclude)
}


export { createEndpoint };

