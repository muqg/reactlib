import * as React from "react"
import {useCallback, useState} from "react"
import {NotificationContext} from "../../contexts"
import {Omit} from "../../utility"
import {Notification, NotificationProps} from "./Notification"

interface Props {
    children?: React.ReactNode
}
export type Notify = (
    content: Required<NotificationProps>["content"],
    options?: Omit<NotificationProps, "content">
) => void

function Notifiable(props: Props) {
    const [notification, setNotification] = useState<NotificationProps>({})
    const setNotificationData: Notify = useCallback(
        (content, options = {}) => {
            setNotification({content, ...options})
        },
        [setNotification]
    )

    return (
        <NotificationContext.Provider value={setNotificationData}>
            <Notification {...notification} />
            {props.children}
        </NotificationContext.Provider>
    )
}

export {Notifiable}
