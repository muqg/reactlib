import * as React from "react"
import {useEffect, useState} from "react"
import {useNotify, useTranslation} from "../hooks"
import {Dict, RequestMethod} from "../utility"
import {isFunction} from "../utility/assertions"
import {request} from "../utility/web"
import {Spinner} from "./Spinner"

const DefaultLoader = <Spinner />
const cacheStorage: Dict<any> = {}

export function invalidateFetchCache(key: string) {
    delete cacheStorage[key]
}

export interface FetcherProps<T> {
    /**
     * Fetched data will not be cached,
     * unless a cache key is provided.
     */
    cache?: string
    children: (fetch: T) => any
    /**
     * An element that will be displayed
     * while data is still loading.
     */
    loader?: JSX.Element | string
    /**
     * Called when an exception occurs.
     */
    onException?: (ex: any) => void
    /**
     * The url to fetch from.
     */
    source: string | (() => Promise<T>)
}

function Fetcher<T extends object = object>({
    cache,
    children,
    loader = DefaultLoader,
    onException,
    source,
}: FetcherProps<T>) {
    /**
     * Initializing fetch from cache will prevent an
     * unnecessary render and loader flashing.
     */
    const cachedFetch = (cache && cacheStorage[cache]) || null
    const [fetch, setFetch] = useState<T | null>(cachedFetch)

    const notify = useNotify()
    const translate = useTranslation()

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        // Skip fetching if data was preloaded from cache
        if (fetch) return

        try {
            let result: T
            if (isFunction(source)) {
                result = await source()
            } else {
                result = await request<T>(RequestMethod.GET, source)
            }

            if (cache) cacheStorage[cache] = result

            setFetch(result)
        } catch (ex) {
            if (onException) onException(ex)
            else {
                console.error(ex)
                notify(translate("error"))
            }
        }
    }

    return fetch ? children(fetch) : loader
}

export {Fetcher}
