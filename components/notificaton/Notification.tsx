import * as React from "react";
import { useContext, useEffect, useRef, useState } from "react";
import { NotificationContext } from "../../contexts";
import { COLOR_CONTRAST, COLOR_DARK, css, styled } from "../../styles";


const NOTIFICATION_DURATION = 2_000

const Wrapper = styled.div`
    border-radius: 4px;
    bottom: 0;
    box-shadow: 0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12);
    left: 50%;
    position: fixed;
    transform: translate(-50%, calc(110%));
    transition: transform .3s cubic-bezier(0, 0, 0.2, 1);
    z-index: 1400;

    ${(p: StyleProps) => p.active && css`
        transform: translateX(-50%);
    `}
`
const Container = styled.div`
    background: ${COLOR_DARK};
    color: ${COLOR_CONTRAST};
    font-size: .9rem;
    letter-spacing: 0.01071em;
    min-width: 280px;
    max-width: 420px;
    padding: 14px 18px;
`

interface StyleProps {
    active: boolean
}

interface Props {
    content?: string
}

function Notification({content}: Props) {
    const [queue, setQueue] = useState<Array<Props["content"]>>([])
    const [current, setCurrent] = useState<Props["content"]>("")
    const notify = useContext(NotificationContext)
    const timeout = useRef(-1)

    useEffect(() => {
        if(content) {
            setQueue(queue => [...queue, content])
            /**
             * Reset the prop coming from above. Since this is the only component
             * updated by this context it should not really affect performance,
             * although measurements have not been made.
             */
            notify("")
        }
    }, [content])

    useEffect(() => {
        if(!current && queue.length) {
            const [next, ...rest] = queue

            setCurrent(next)
            setQueue(rest)

            timeout.current = setTimeout(
                () => setCurrent(""),
                NOTIFICATION_DURATION
            ) as any
        }
    }, [current, queue.length])

    /**
     * Clear timeout to prevent possible memory leaks
     * and updates on unmounted component.
     */
    useEffect(() => () => clearTimeout(timeout.current), [])

    return (
        <Wrapper active={!!current}>
            <Container>
                {current}
            </Container>
        </Wrapper>
    )
}


export { Notification };

