import {useEffect} from "react"

/**
 * Sets the document title to the given one. On unmount it
 * reverts to the previous title.
 *
 * @param title The document title.
 */
function useDocumentTitle(title: string) {
    useEffect(() => {
        const prevTitle = document.title
        document.title = title

        return () => {
            document.title = prevTitle
        }
    }, [title])
}

export {useDocumentTitle}
