import { useEffect, useRef, useState } from "react";


interface Props {
    /**
     * Expiration timeout seconds.
     */
    in: number
    /**
     * Callback for when expired.
     */
    then?: () => void
    children?: any
}


function Expire(props: Props) {
    const [visible, setVisible] = useState(true)
    const timer = useRef<number | undefined>(undefined)

    useEffect(() => {
        const seconds = Math.max(0, props.in) * 1000
        // @ts-ignore setTimeout returns a number.
        timer.current = setTimeout(expire, seconds)

        setVisible(true)

        return () => clearTimeout(timer.current)
    }, [props.children])

    function expire() {
        setVisible(false)
        timer.current = undefined

        if(props.then)
            props.then()
    }

    return visible ? props.children : null
}


export { Expire };

