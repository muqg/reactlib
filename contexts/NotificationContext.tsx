import * as React from "react";
import { Notify } from "../components/notificaton/Notifiable";

export const NotificationContext = React.createContext<Notify>(
    () => console.error("Can only notify within a Notifiable component")
)

NotificationContext.displayName = "Notification"

