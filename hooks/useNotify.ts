import {useContext} from "react"
import {NotificationContext} from "../components/notificaton/Notifiable"

function useNotify() {
    return useContext(NotificationContext)
}

export {useNotify}
