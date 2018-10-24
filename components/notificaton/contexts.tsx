import * as React from "react";

export type Notify = (message: string) => void

export interface NotificationData {
    message: string
}

export const NotificationContext = React.createContext<Notify>(() => {})
export const NotificationDataContext = React.createContext<NotificationData>({
    message: ""
})
