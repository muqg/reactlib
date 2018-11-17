import * as React from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useInitialRender } from "../hooks";
import { COLOR_PRIMARY_DARK, COLOR_PRIMARY_LIGHT, styled } from "../styles";
import { flex, position } from "../styles/mixins";
import { wait } from "../utility";
import { padStart } from "../utility/string";


const Container = styled.div`
    background: ${COLOR_PRIMARY_LIGHT};
    border-radius: 0 0 8px 8px;
    box-shadow: 0 2px 3px ${COLOR_PRIMARY_DARK};
    transform: translateX(-50%);
    ${position("fixed", "0", "", "", "50%")}
    ${flex()}
`
const Timepiece = styled.div`
    font-size: 1.2em;
    line-height: 1.2em;
    padding: 6px 15px;

    &:first-of-type {
        border-right: 1px solid ${COLOR_PRIMARY_DARK};
    }
`


interface Props {
    /**
     * Time limit in seconds.
     */
    limit: number

    /**
     * Called when timer expires.
     */
    onExpire?: () => void

    /**
     * Called every second.
     */
    everySecond?: (secondsLeft: number, minutesLeft: number) => void

    /**
     * Called every minute.
     */
    everyMinute?: (secondsLeft: number, minutes: number) => void
}


const Timer = React.memo((props: Props) => {
    const initialRender = useInitialRender()
    const [time, setTime] = useState({
        limit: props.limit,
        minutes: 0,
        seconds: 0
    })

    useEffect(() => {
        tick()
    }, [time.limit])

    async function tick() {
        if(time.limit <= 0)
            return

        if(!initialRender)
            // Ever wondered how long can a single second be...?
            await wait(1000);

        const limit = time.limit - 1
        const minutes = Math.floor(limit / 60)
        const seconds = limit % 60

        if(props.everySecond)
            props.everySecond(seconds, minutes)
        if(props.everyMinute && time.minutes > minutes)
            props.everyMinute(seconds, minutes)
        if(limit === 0 && props.onExpire)
            props.onExpire()

        setTime({limit, minutes, seconds})
    }

    return createPortal(
        <Container>
            <Timepiece>
                {padStart(time.minutes.toString(), 2)}
            </Timepiece>
            <Timepiece>
                {padStart(time.seconds.toString(), 2)}
            </Timepiece>
        </Container>,

        document.body
    )
})


export { Timer };

