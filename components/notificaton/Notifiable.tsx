import * as React from "react";
import { useState } from "react";
import { Notification } from "./Notification";

interface Props {
    children?: React.ReactNode
}
export type Notify = (message: string) => void

export const NotificationContext = React.createContext<Notify>(() => {})

function Notifiable(props: Props) {
    const [message, setMessage] = useState("")

    return (
        <NotificationContext.Provider value={setMessage}>
                <Notification message={message} />
                {props.children}
        </NotificationContext.Provider>
    )
}


export { Notifiable };

