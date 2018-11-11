import * as React from "react";
import { useCallback, useContext, useEffect } from "react";
import { NotificationContext } from ".";
import { COLOR_BLACK, COLOR_PRIMARY_DARK, COLOR_PRIMARY_LIGHT, css, styled } from "../../styles";
import { position } from "../../styles/mixins";
import { delay } from "../../utility";


const NOTIFICATION_DURATION = 2_000

const Container = styled.div`
    background: ${COLOR_PRIMARY_LIGHT};
    border-radius: 3px;
    box-shadow: 0 0 9px -1px ${COLOR_PRIMARY_DARK};
    box-sizing: border-box;
    color: ${COLOR_BLACK};
    cursor: default;
    padding: 12px;
    text-align: center;
    /* Y translate should account for box-shadow and bottom offset. */
    transform: translate(-50%, calc(100% + 15px));
    transition: transform .3s;
    width: 250px;
    z-index: 250;
    ${position("fixed", "", "", "12px", "50%")}

    ${(p: StyleProps) => p.active && css`
        transform: translateX(-50%);
    `}
`

interface StyleProps {
    active: boolean
}

interface Props {
    message: string
}

const Notification = React.memo(({message}: Props) => {
    const notify = useContext(NotificationContext)

    const hide = useCallback(
        delay(() => notify(""), NOTIFICATION_DURATION),
        [notify]
    )

    useEffect(() => {
        if(message.length)
            hide()
    }, [message])

    return (
        <Container active={message.length > 0}>
            {message}
        </Container>
    )
})


export { Notification };

