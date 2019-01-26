import * as React from "react";
import { useState } from "react";
import { NotificationContext } from "../../contexts";
import { Notification } from "./Notification";

interface Props {
    children?: React.ReactNode
}
export type Notify = (content: string) => void

function Notifiable(props: Props) {
    const [content, setContent] = useState("")

    return (
        <NotificationContext.Provider value={setContent}>
                <Notification content={content} />
                {props.children}
        </NotificationContext.Provider>
    )
}


export { Notifiable };

