import {useLayoutEffect} from "react"

interface Props {
    title: string
}

function DocumentTitle({title}: Props) {
    /**
     * NOTICE
     * This component cannot be replaced by a simple hook due to the fact that
     * children will change title before the parent component and be overidden
     * when multiple components in a component tree attempt to change the title.
     */
    useLayoutEffect(() => {
        document.title = title
    })

    return null
}

export {DocumentTitle}
