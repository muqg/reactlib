import * as React from "react"
import {useCallback, useState} from "react"
import {Notify} from "../component-types"
import {Notification, NotificationProps} from "./Notification"

export const NotificationContext = React.createContext<Notify>(() => {
  if (__DEV__) {
    console.log("Can only notify within a Notifiable component")
  }
})
NotificationContext.displayName = "NotificationContext"

interface Props {
  children?: React.ReactNode
}

export function Notifiable(props: Props) {
  const [notification, setNotification] = useState<NotificationProps>({})
  const setNotificationData: Notify = useCallback(
    (content, options = {}) => {
      setNotification({content, ...options})
    },
    [setNotification],
  )

  return (
    <NotificationContext.Provider value={setNotificationData}>
      <Notification {...notification} />
      {props.children}
    </NotificationContext.Provider>
  )
}
