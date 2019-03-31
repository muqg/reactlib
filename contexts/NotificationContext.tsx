import * as React from "react"
import {Notify} from "../components/notificaton/Notifiable"

export const NotificationContext = React.createContext<Notify>(() => {
    if (__DEV__) {
        console.log("Can only notify within a Notifiable component")
    }
})

NotificationContext.displayName = "Notification"
